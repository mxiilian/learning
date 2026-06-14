mod config;
mod handlers;
mod middleware;
mod models;

use std::net::{IpAddr, Ipv4Addr, SocketAddr};
use std::num::NonZeroU32;
use std::sync::Arc;

use axum::extract::ConnectInfo;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::{routing::{get, post}, Extension, Router};
use dotenvy::dotenv;
use governor::{clock::DefaultClock, state::keyed::DashMapStateStore, Quota, RateLimiter};
use sqlx::postgres::{PgConnectOptions, PgPoolOptions};
use std::str::FromStr;
use tower_http::cors::{CorsLayer, Any};
use axum::http::{Method, header};
use config::SupabaseConfig;
use tracing::{info, Level};

use handlers::vocab::{create_vocab, delete_vocab, get_vocab, get_vocabs, update_vocab, upload_image};
use handlers::users::{create_user, get_user, login_user, username_exists};
use handlers::review::{add_vocab_to_user, get_due_vocabs, submit_review};
use handlers::stats::{get_home_stats, get_vocab_stats, get_user_vocab_list};
use handlers::debug::time_travel;

type LoginLimiter = RateLimiter<IpAddr, DashMapStateStore<IpAddr>, DefaultClock>;

/*
  Für die Produktion sollte die CORS-Policy restriktiver sein, z.B.:
  .allow_origin("https://deine-app.com".parse::<HeaderValue>().unwrap())
*/

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    tracing_subscriber::fmt()
        .with_max_level(Level::INFO)
        .with_writer(std::io::stdout)
        .init();

    dotenv().ok();
    let url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let connect_opts = PgConnectOptions::from_str(&url)
        .expect("Ungültige DATABASE_URL")
        .statement_cache_capacity(0);
    let pool = PgPoolOptions::new().connect_with(connect_opts).await?;

    let supabase_config = SupabaseConfig {
        url: std::env::var("SUPABASE_URL").expect("SUPABASE_URL must be set"),
        service_key: std::env::var("SUPABASE_SERVICE_KEY").expect("SUPABASE_SERVICE_KEY must be set"),
    };
    let http_client = reqwest::Client::new();
    println!("Connected to the database successfully!");

    // JWT-Secret einmalig beim Start einlesen
    let jwt_secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
    middleware::auth::init_jwt_secret(jwt_secret);

    // Rate-Limiting: max. 10 Login-Versuche pro Minute pro IP
    let login_limiter: Arc<LoginLimiter> = Arc::new(
        RateLimiter::dashmap(Quota::per_minute(NonZeroU32::new(10).unwrap())),
    );

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE]);

    let limiter = login_limiter.clone();
    let login_router = Router::new()
        .route("/users/login", post(login_user))
        .route_layer(axum::middleware::from_fn(
            move |req: axum::extract::Request, next: axum::middleware::Next| {
                let limiter = limiter.clone();
                async move {
                    let ip = req
                        .extensions()
                        .get::<ConnectInfo<SocketAddr>>()
                        .map(|ci| ci.0.ip())
                        .unwrap_or(IpAddr::V4(Ipv4Addr::UNSPECIFIED));

                    if limiter.check_key(&ip).is_err() {
                        return StatusCode::TOO_MANY_REQUESTS.into_response();
                    }

                    next.run(req).await
                }
            },
        ));

    let app = Router::new()
        .route("/", get(root))
        // Vocab: GET liefert public + eigene, POST erfordert Auth
        .route("/vocab", get(get_vocabs).post(create_vocab))
        .route("/vocab/{id}", get(get_vocab).put(update_vocab).delete(delete_vocab))
        // User
        .route("/users", post(create_user))
        .route("/users/{id}", get(get_user))
        .route("/username/{username}", post(username_exists))
        // Review & Deck
        .route("/users/{id}/review", get(get_due_vocabs).post(submit_review))
        .route("/users/{id}/vocab/{vocab_id}", post(add_vocab_to_user))
        // Home-Statistiken
        .route("/users/{id}/stats", get(get_home_stats))
        // Vokabeln-Übersicht (mit Genauigkeit + Heatmap)
        .route("/users/{id}/vocab-stats", get(get_vocab_stats))
        // Alle Vokabeln des Users mit Lernfortschritt
        .route("/users/{id}/vocab-list", get(get_user_vocab_list))
        // Debug (nur für Entwicklung)
        .route("/debug/users/{id}/time-travel", post(time_travel))
        // Bild-Upload (erfordert Auth)
        .route("/upload/image", post(upload_image))
        .merge(login_router)
        .layer(cors)
        .layer(Extension(http_client))
        .layer(Extension(supabase_config))
        .layer(Extension(pool));

    let port = std::env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{port}")).await.unwrap();
    info!("Server is running on http://0.0.0.0:{port}");
    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await
    .unwrap();

    Ok(())
}

async fn root() -> &'static str {
    "Hello, World!"
}
