-- Vokabeln bekommen Ownership: wer hat sie erstellt, und sind sie öffentlich?
ALTER TABLE vocab
    ADD COLUMN created_by_user_id INT REFERENCES user_accounts(id) ON DELETE SET NULL,
    ADD COLUMN is_public           BOOLEAN NOT NULL DEFAULT true;

-- Bestehende Vokabeln (angelegt ohne User) bleiben öffentlich (DEFAULT true)

-- Admins können Vokabeln für alle freigeben
ALTER TABLE user_accounts
    ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;
