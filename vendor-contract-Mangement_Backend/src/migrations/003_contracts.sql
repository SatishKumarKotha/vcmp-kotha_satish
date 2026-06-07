CREATE TABLE contracts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    contract_number VARCHAR(30) NOT NULL UNIQUE,
    vendor_id INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM(
        'draft',
        'active',
        'expired',
        'terminated'
    ) NOT NULL DEFAULT 'draft',
    document_url VARCHAR(500) NULL,
    created_by INT UNSIGNED NOT NULL,
    approved_by INT UNSIGNED NULL,
    approved_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_contract_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_contract_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_contract_approved_by
        FOREIGN KEY (approved_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;