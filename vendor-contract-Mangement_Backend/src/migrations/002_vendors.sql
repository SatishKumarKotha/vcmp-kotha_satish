CREATE TABLE vendors (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendor_code VARCHAR(20) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    gstin VARCHAR(20) NULL,
    address TEXT NULL,
    category VARCHAR(100) NOT NULL,
    status ENUM(
        'pending',
        'approved',
        'rejected',
        'active',
        'inactive',
        'blacklisted'
    ) NOT NULL DEFAULT 'pending',
    rejection_reason TEXT NULL,
    onboarded_by INT UNSIGNED NOT NULL,
    approved_by INT UNSIGNED NULL,
    approved_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendor_onboarded_by
        FOREIGN KEY (onboarded_by)
        REFERENCES users(id),
    CONSTRAINT fk_vendor_approved_by
        FOREIGN KEY (approved_by)
        REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;