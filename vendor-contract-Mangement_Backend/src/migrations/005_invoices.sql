CREATE TABLE invoices (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    po_id INT UNSIGNED NOT NULL,
    vendor_id INT UNSIGNED NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE NULL,
    status ENUM(
        'pending',
        'approved',
        'paid',
        'overdue',
        'disputed'
    ) NOT NULL DEFAULT 'pending',
    payment_ref VARCHAR(100) NULL,
    reviewed_by INT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_invoice_po
        FOREIGN KEY (po_id)
        REFERENCES purchase_orders(id),
    CONSTRAINT fk_invoice_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(id),
    CONSTRAINT fk_invoice_reviewed_by
        FOREIGN KEY (reviewed_by)
        REFERENCES users(id)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;