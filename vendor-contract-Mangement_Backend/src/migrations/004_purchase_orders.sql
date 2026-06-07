CREATE TABLE purchase_orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    po_number VARCHAR(30) NOT NULL UNIQUE,
    vendor_id INT UNSIGNED NOT NULL,
    contract_id INT UNSIGNED NULL,
    title VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    tax_percent DECIMAL(5,2) NOT NULL DEFAULT 18.00,
    total_amount DECIMAL(15,2) NOT NULL,
    delivery_date DATE NOT NULL,
    status ENUM(
        'draft',
        'sent',
        'fulfilled',
        'cancelled'
    ) NOT NULL DEFAULT 'draft',
    raised_by INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_po_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_po_contract
        FOREIGN KEY (contract_id)
        REFERENCES contracts(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_po_raised_by
        FOREIGN KEY (raised_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;