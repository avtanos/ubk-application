-- DDL миграции согласно ТУ
-- Создание основных таблиц для системы УБК

-- 1. Заявители
CREATE TABLE applicant (
    id BIGSERIAL PRIMARY KEY,
    pin VARCHAR(16) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    gender_code CHAR(1) NOT NULL,
    birth_date DATE NOT NULL,
    age INT NOT NULL,
    citizenship_code VARCHAR(3) NOT NULL,
    nationality_code VARCHAR(3),
    education_code VARCHAR(10),
    marital_status VARCHAR(20),
    applicant_category VARCHAR(50),
    social_protection_authority VARCHAR(100),
    language VARCHAR(5) DEFAULT 'ru',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by BIGINT,
    updated_by BIGINT
);

-- 2. Документы, удостоверяющие личность
CREATE TABLE identity_doc (
    id BIGSERIAL PRIMARY KEY,
    applicant_id BIGINT NOT NULL REFERENCES applicant(id) ON DELETE CASCADE,
    family_member_id BIGINT REFERENCES family_member(id) ON DELETE CASCADE,
    doc_type VARCHAR(10) NOT NULL,
    series VARCHAR(10) NOT NULL,
    number VARCHAR(20) NOT NULL,
    issue_date DATE NOT NULL,
    issuer_code VARCHAR(10) NOT NULL,
    issuing_authority VARCHAR(100),
    expiry_date DATE NOT NULL,
    iin VARCHAR(12),
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. Дополнительные удостоверения
CREATE TABLE applicant_additional_id (
    id BIGSERIAL PRIMARY KEY,
    applicant_id BIGINT NOT NULL REFERENCES applicant(id) ON DELETE CASCADE,
    id_type VARCHAR(20) NOT NULL,
    series VARCHAR(10),
    number VARCHAR(20),
    issuing_authority VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. Согласия
CREATE TABLE consent (
    id BIGSERIAL PRIMARY KEY,
    applicant_id BIGINT NOT NULL REFERENCES applicant(id) ON DELETE CASCADE,
    pdn_self BOOLEAN NOT NULL DEFAULT FALSE,
    pdn_children BOOLEAN NOT NULL DEFAULT FALSE,
    truth_confirm BOOLEAN NOT NULL DEFAULT FALSE,
    terms_ack BOOLEAN NOT NULL DEFAULT FALSE,
    given_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5. Связь с органами соцзащиты
CREATE TABLE social_authority_link (
    id BIGSERIAL PRIMARY KEY,
    applicant_id BIGINT NOT NULL REFERENCES applicant(id) ON DELETE CASCADE,
    municipal_authority_code VARCHAR(20) NOT NULL,
    applicant_type_code VARCHAR(20) NOT NULL,
    category_code VARCHAR(20) NOT NULL,
    disability_category_code VARCHAR(20),
    msek_ref_number VARCHAR(50),
    msek_issue_date DATE,
    dsu_ref_number VARCHAR(50),
    dsu_issue_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 6. Категории заявителя (многие-ко-многим)
CREATE TABLE applicant_category (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    category_code VARCHAR(20) NOT NULL,
    is_exception BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_date DATE NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 7. Платежные реквизиты
CREATE TABLE payment_requisite (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    requisite_type VARCHAR(10) NOT NULL,
    bank_code VARCHAR(20),
    personal_account VARCHAR(30),
    bank_account VARCHAR(34),
    card_account VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 8. Адреса
CREATE TABLE address (
    id BIGSERIAL PRIMARY KEY,
    applicant_id BIGINT NOT NULL REFERENCES applicant(id) ON DELETE CASCADE,
    region_code VARCHAR(10) NOT NULL,
    raion_code VARCHAR(10) NOT NULL,
    locality_code VARCHAR(10) NOT NULL,
    street VARCHAR(100) NOT NULL,
    house VARCHAR(20) NOT NULL,
    flat VARCHAR(10),
    addr_type CHAR(4) NOT NULL,
    postal_code VARCHAR(10),
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 9. Контакты
CREATE TABLE contact (
    id BIGSERIAL PRIMARY KEY,
    applicant_id BIGINT NOT NULL REFERENCES applicant(id) ON DELETE CASCADE,
    contact_type_code VARCHAR(20) NOT NULL,
    value VARCHAR(100) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 10. Члены семьи
CREATE TABLE family_member (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    age INT NOT NULL,
    gender_code CHAR(1) NOT NULL,
    relation_code VARCHAR(20) NOT NULL,
    pin_or_doc VARCHAR(32),
    citizenship_code VARCHAR(3),
    child_category_code VARCHAR(20),
    birth_cert_no VARCHAR(32),
    birth_cert_date DATE,
    birth_cert_issuer VARCHAR(100),
    disability_flag BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 11. Доходы
CREATE TABLE income (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    member_id BIGINT REFERENCES family_member(id) ON DELETE CASCADE,
    income_type_code VARCHAR(10) NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    periodicity CHAR(1) NOT NULL,
    period_from DATE NOT NULL,
    period_to DATE,
    source_ref VARCHAR(100),
    evidence_doc_id BIGINT REFERENCES document(id),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 12. Земельные участки
CREATE TABLE land_plot (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    type_code VARCHAR(10) NOT NULL,
    area_hectare NUMERIC(10,3) NOT NULL,
    ownership_type VARCHAR(20),
    location VARCHAR(200),
    estimated_value NUMERIC(12,2),
    is_owned BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 13. Скот
CREATE TABLE livestock (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    type_code VARCHAR(10) NOT NULL,
    qty INT NOT NULL,
    conv_units NUMERIC(8,3) NOT NULL,
    estimated_value NUMERIC(12,2),
    is_owned BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 14. Транспортные средства
CREATE TABLE vehicle (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    type_code VARCHAR(10) NOT NULL,
    make_model VARCHAR(100),
    year SMALLINT NOT NULL,
    is_light_car BOOLEAN NOT NULL,
    reg_no VARCHAR(20),
    estimated_value NUMERIC(12,2),
    is_owned BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 15. Показатели домохозяйства
CREATE TABLE household_metrics (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    calculation_period_id BIGINT,
    total_income_month NUMERIC(14,2) NOT NULL,
    per_capita_income NUMERIC(14,2) NOT NULL,
    conv_units_total NUMERIC(8,3) NOT NULL,
    income_criteria_flag BOOLEAN NOT NULL DEFAULT FALSE,
    property_criteria_flag BOOLEAN NOT NULL DEFAULT FALSE,
    family_criteria_flag BOOLEAN NOT NULL DEFAULT FALSE,
    vehicle_criteria_flag BOOLEAN NOT NULL DEFAULT FALSE,
    guaranteed_minimum_income NUMERIC(14,2) NOT NULL,
    calculated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 16. Назначения пособий
CREATE TABLE benefit_assignment (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    benefit_type VARCHAR(20) NOT NULL,
    category_code VARCHAR(20) NOT NULL,
    period_from DATE NOT NULL,
    period_to DATE,
    decision VARCHAR(10) NOT NULL,
    decision_reason_code VARCHAR(20),
    assigned_amount NUMERIC(12,2) NOT NULL,
    current_amount NUMERIC(12,2) NOT NULL,
    assignment_date DATE NOT NULL,
    effective_date DATE NOT NULL,
    termination_date DATE,
    assigned_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 17. Расчеты пособий
CREATE TABLE calculation (
    id BIGSERIAL PRIMARY KEY,
    benefit_assignment_id BIGINT REFERENCES benefit_assignment(id) ON DELETE CASCADE,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    base_amount NUMERIC(12,2) NOT NULL,
    children_count SMALLINT NOT NULL,
    region_coeff NUMERIC(4,2) NOT NULL,
    add_coeff NUMERIC(3,2) NOT NULL,
    border_bonus NUMERIC(12,2) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    calculation_method VARCHAR(50),
    calculation_formula TEXT,
    is_automatic BOOLEAN DEFAULT TRUE,
    calculated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    calculated_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 18. Перерасчеты
CREATE TABLE recalculation (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT REFERENCES application(id) ON DELETE CASCADE,
    benefit_assignment_id BIGINT REFERENCES benefit_assignment(id) ON DELETE CASCADE,
    recalc_type VARCHAR(20) NOT NULL,
    old_amount NUMERIC(12,2),
    new_amount NUMERIC(12,2),
    effective_date DATE NOT NULL,
    status VARCHAR(12) NOT NULL DEFAULT 'PENDING',
    reason TEXT,
    processed_by BIGINT,
    processed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 19. Прекращения
CREATE TABLE termination (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    benefit_assignment_id BIGINT REFERENCES benefit_assignment(id) ON DELETE CASCADE,
    reason_code VARCHAR(20) NOT NULL,
    decision_date DATE NOT NULL,
    effective_date DATE NOT NULL,
    status VARCHAR(12) NOT NULL DEFAULT 'PENDING',
    processed_by BIGINT,
    processed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 20. Возвраты
CREATE TABLE refund_return (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    benefit_assignment_id BIGINT REFERENCES benefit_assignment(id) ON DELETE CASCADE,
    return_reason_code VARCHAR(20) NOT NULL,
    return_date DATE NOT NULL,
    amount NUMERIC(12,2),
    note VARCHAR(500),
    status VARCHAR(12) NOT NULL DEFAULT 'PENDING',
    processed_by BIGINT,
    processed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 21. Передоформления
CREATE TABLE reissue (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    benefit_assignment_id BIGINT REFERENCES benefit_assignment(id) ON DELETE CASCADE,
    to_person_id BIGINT,
    reason_code VARCHAR(20) NOT NULL,
    decision_date DATE NOT NULL,
    status VARCHAR(12) NOT NULL DEFAULT 'PENDING',
    processed_by BIGINT,
    processed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 22. Специальные компенсации
CREATE TABLE special_compensation (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    benefit_assignment_id BIGINT REFERENCES benefit_assignment(id) ON DELETE CASCADE,
    type_code VARCHAR(20) NOT NULL,
    reason_code VARCHAR(20) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    period_from DATE NOT NULL,
    period_to DATE,
    status VARCHAR(12) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 23. Журнал аудита
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    field_name VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    user_id BIGINT NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    correlation_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 24. Протокол решения
CREATE TABLE decision_protocol (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    application_number VARCHAR(50) NOT NULL,
    decision_date TIMESTAMP NOT NULL,
    responsible_person VARCHAR(255) NOT NULL,
    responsible_position VARCHAR(100) NOT NULL,
    decision VARCHAR(20) NOT NULL,
    reason TEXT,
    basis TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Создание индексов для производительности
CREATE INDEX idx_identity_doc_applicant ON identity_doc(applicant_id);
CREATE UNIQUE INDEX uq_identity_primary ON identity_doc(applicant_id, is_primary) WHERE is_primary = TRUE;
CREATE INDEX idx_applicant_category_app ON applicant_category(application_id);
CREATE INDEX idx_payment_requisite_app ON payment_requisite(application_id);
CREATE INDEX idx_address_applicant ON address(applicant_id);
CREATE INDEX idx_contact_applicant ON contact(applicant_id);
CREATE INDEX idx_family_member_app ON family_member(application_id);
CREATE INDEX idx_income_app ON income(application_id);
CREATE INDEX idx_income_member ON income(member_id);
CREATE INDEX idx_land_plot_app ON land_plot(application_id);
CREATE INDEX idx_livestock_app ON livestock(application_id);
CREATE INDEX idx_vehicle_app ON vehicle(application_id);
CREATE INDEX idx_household_metrics_app ON household_metrics(application_id);
CREATE INDEX idx_benefit_assignment_app ON benefit_assignment(application_id);
CREATE INDEX idx_calculation_app ON calculation(application_id);
CREATE INDEX idx_calculation_active ON calculation(application_id, is_active);
CREATE INDEX idx_recalculation_app ON recalculation(application_id);
CREATE INDEX idx_termination_app ON termination(application_id);
CREATE INDEX idx_refund_app ON refund_return(application_id);
CREATE INDEX idx_reissue_app ON reissue(application_id);
CREATE INDEX idx_special_compensation_app ON special_compensation(application_id);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_timestamp ON audit_log(created_at);
CREATE INDEX idx_decision_protocol_app ON decision_protocol(application_id);

-- Создание ограничений
ALTER TABLE identity_doc ADD CONSTRAINT chk_identity_doc_issue_date CHECK (issue_date <= CURRENT_DATE);
ALTER TABLE identity_doc ADD CONSTRAINT chk_identity_doc_expiry_date CHECK (expiry_date >= CURRENT_DATE);
ALTER TABLE income ADD CONSTRAINT chk_income_amount CHECK (amount >= 0);
ALTER TABLE income ADD CONSTRAINT chk_income_periodicity CHECK (periodicity IN ('M', 'Y'));
ALTER TABLE income ADD CONSTRAINT chk_income_period_from CHECK (period_from <= CURRENT_DATE);
ALTER TABLE income ADD CONSTRAINT chk_income_period_to CHECK (period_to IS NULL OR period_to >= period_from);
ALTER TABLE land_plot ADD CONSTRAINT chk_land_plot_area CHECK (area_hectare >= 0);
ALTER TABLE livestock ADD CONSTRAINT chk_livestock_qty CHECK (qty >= 0);
ALTER TABLE livestock ADD CONSTRAINT chk_livestock_conv_units CHECK (conv_units >= 0);
ALTER TABLE vehicle ADD CONSTRAINT chk_vehicle_year CHECK (year BETWEEN 1900 AND EXTRACT(YEAR FROM CURRENT_DATE));
ALTER TABLE calculation ADD CONSTRAINT chk_calculation_base_amount CHECK (base_amount >= 0);
ALTER TABLE calculation ADD CONSTRAINT chk_calculation_children_count CHECK (children_count >= 0);
ALTER TABLE calculation ADD CONSTRAINT chk_calculation_region_coeff CHECK (region_coeff BETWEEN 1.0 AND 1.5);
ALTER TABLE calculation ADD CONSTRAINT chk_calculation_add_coeff CHECK (add_coeff IN (1.0, 1.2));
ALTER TABLE calculation ADD CONSTRAINT chk_calculation_border_bonus CHECK (border_bonus >= 0);
ALTER TABLE calculation ADD CONSTRAINT chk_calculation_total_amount CHECK (total_amount >= 0);
ALTER TABLE calculation ADD CONSTRAINT chk_calculation_valid_period CHECK (valid_to IS NULL OR valid_to >= valid_from);
ALTER TABLE address ADD CONSTRAINT chk_address_type CHECK (addr_type IN ('REG', 'FACT'));
ALTER TABLE address ADD CONSTRAINT chk_address_street_length CHECK (LENGTH(street) <= 100);
ALTER TABLE address ADD CONSTRAINT chk_address_house_length CHECK (LENGTH(house) <= 20);
ALTER TABLE address ADD CONSTRAINT chk_address_flat_length CHECK (LENGTH(flat) <= 10);
