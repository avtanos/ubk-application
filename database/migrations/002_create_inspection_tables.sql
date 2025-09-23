-- DDL миграция для системы выездных проверок
-- Создание таблиц для выездных проверок и актов

-- 1. Таблица выездных проверок
CREATE TABLE inspection (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    inspection_number VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'ASSIGNED',
    type VARCHAR(20) NOT NULL DEFAULT 'PRIMARY',
    priority VARCHAR(10) NOT NULL DEFAULT 'MEDIUM',
    assigned_date TIMESTAMP NOT NULL DEFAULT NOW(),
    scheduled_date DATE,
    scheduled_time TIME,
    inspector_id BIGINT NOT NULL,
    inspector_name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Таблица актов выездных проверок
CREATE TABLE inspection_report (
    id BIGSERIAL PRIMARY KEY,
    inspection_id BIGINT NOT NULL REFERENCES inspection(id) ON DELETE CASCADE,
    application_id BIGINT NOT NULL REFERENCES application(id) ON DELETE CASCADE,
    report_number VARCHAR(50) NOT NULL UNIQUE,
    report_date DATE NOT NULL,
    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,
    living_address VARCHAR(500) NOT NULL,
    registration_address VARCHAR(500) NOT NULL,
    regional_status VARCHAR(20) NOT NULL,
    regional_status_other VARCHAR(100),
    
    -- Данные о заявителе
    applicant_full_name VARCHAR(255) NOT NULL,
    applicant_pin VARCHAR(16) NOT NULL,
    applicant_birth_date DATE NOT NULL,
    identity_doc_series VARCHAR(10) NOT NULL,
    identity_doc_number VARCHAR(20) NOT NULL,
    identity_doc_issued_by VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    
    -- Жилищные условия
    housing_type VARCHAR(20) NOT NULL,
    housing_type_other VARCHAR(50),
    housing_ownership VARCHAR(20) NOT NULL,
    housing_area DECIMAL(8,2) NOT NULL,
    housing_rooms_count INT NOT NULL,
    water_supply BOOLEAN NOT NULL DEFAULT FALSE,
    electricity BOOLEAN NOT NULL DEFAULT FALSE,
    heating_type VARCHAR(20) NOT NULL,
    sanitary_conditions TEXT,
    housing_assessment TEXT,
    
    -- Доходы
    main_income TEXT,
    additional_income TEXT,
    supporting_documents TEXT[],
    
    -- Имущество
    has_land_plot BOOLEAN NOT NULL DEFAULT FALSE,
    land_plot_type VARCHAR(20),
    land_plot_area DECIMAL(8,2),
    land_plot_usage VARCHAR(200),
    cattle_count INT NOT NULL DEFAULT 0,
    small_cattle_count INT NOT NULL DEFAULT 0,
    other_livestock VARCHAR(200),
    has_vehicle BOOLEAN NOT NULL DEFAULT FALSE,
    vehicle_make_model VARCHAR(100),
    real_estate VARCHAR(200),
    has_bank_deposits BOOLEAN NOT NULL DEFAULT FALSE,
    bank_deposits_amount DECIMAL(12,2),
    
    -- Выводы
    family_composition_matches BOOLEAN NOT NULL,
    living_conditions TEXT,
    income_level TEXT,
    meets_criteria VARCHAR(20) NOT NULL,
    rejection_reason TEXT,
    
    -- Подписи
    specialist_full_name VARCHAR(255) NOT NULL,
    specialist_position VARCHAR(100) NOT NULL,
    specialist_signature TEXT,
    supervisor_full_name VARCHAR(255),
    supervisor_signature TEXT,
    applicant_signature TEXT,
    
    -- Приложения
    has_photos BOOLEAN NOT NULL DEFAULT FALSE,
    has_document_copies BOOLEAN NOT NULL DEFAULT FALSE,
    has_other_materials BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Метаданные
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. Таблица членов семьи для акта проверки
CREATE TABLE inspection_family_member (
    id BIGSERIAL PRIMARY KEY,
    inspection_report_id BIGINT NOT NULL REFERENCES inspection_report(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    gender CHAR(1) NOT NULL,
    birth_date DATE NOT NULL,
    pin VARCHAR(16),
    document VARCHAR(100),
    relation VARCHAR(50) NOT NULL,
    citizenship VARCHAR(3),
    special_status VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. Таблица фотографий проверки
CREATE TABLE inspection_photo (
    id BIGSERIAL PRIMARY KEY,
    inspection_report_id BIGINT NOT NULL REFERENCES inspection_report(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    uploaded_by BIGINT NOT NULL
);

-- Создание индексов для производительности
CREATE INDEX idx_inspection_application ON inspection(application_id);
CREATE INDEX idx_inspection_inspector ON inspection(inspector_id);
CREATE INDEX idx_inspection_status ON inspection(status);
CREATE INDEX idx_inspection_type ON inspection(type);
CREATE INDEX idx_inspection_scheduled ON inspection(scheduled_date);
CREATE INDEX idx_inspection_priority ON inspection(priority);
CREATE INDEX idx_inspection_report_inspection ON inspection_report(inspection_id);
CREATE INDEX idx_inspection_report_application ON inspection_report(application_id);
CREATE INDEX idx_inspection_report_status ON inspection_report(status);
CREATE INDEX idx_inspection_family_member_report ON inspection_family_member(inspection_report_id);
CREATE INDEX idx_inspection_photo_report ON inspection_photo(inspection_report_id);

-- Создание ограничений
ALTER TABLE inspection ADD CONSTRAINT chk_inspection_status CHECK (status IN ('ASSIGNED', 'PREPARATION', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REPEAT'));
ALTER TABLE inspection ADD CONSTRAINT chk_inspection_type CHECK (type IN ('PRIMARY', 'REPEAT', 'COMPLAINT'));
ALTER TABLE inspection ADD CONSTRAINT chk_inspection_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT'));
ALTER TABLE inspection ADD CONSTRAINT chk_inspection_scheduled_date CHECK (scheduled_date >= CURRENT_DATE);

ALTER TABLE inspection_report ADD CONSTRAINT chk_inspection_report_regional_status CHECK (regional_status IN ('HIGH_MOUNTAIN', 'REMOTE', 'BORDER', 'OTHER'));
ALTER TABLE inspection_report ADD CONSTRAINT chk_inspection_report_housing_type CHECK (housing_type IN ('HOUSE', 'APARTMENT', 'RENTAL', 'DORMITORY', 'OTHER'));
ALTER TABLE inspection_report ADD CONSTRAINT chk_inspection_report_housing_ownership CHECK (housing_ownership IN ('OWNED', 'RENTED', 'TEMPORARY'));
ALTER TABLE inspection_report ADD CONSTRAINT chk_inspection_report_heating_type CHECK (heating_type IN ('CENTRAL', 'STOVE', 'NONE'));
ALTER TABLE inspection_report ADD CONSTRAINT chk_inspection_report_meets_criteria CHECK (meets_criteria IN ('YES', 'NO', 'REQUIRES_ADDITIONAL_CHECK'));
ALTER TABLE inspection_report ADD CONSTRAINT chk_inspection_report_status CHECK (status IN ('DRAFT', 'COMPLETED', 'APPROVED', 'REJECTED'));
ALTER TABLE inspection_report ADD CONSTRAINT chk_inspection_report_housing_area CHECK (housing_area > 0);
ALTER TABLE inspection_report ADD CONSTRAINT chk_inspection_report_housing_rooms CHECK (housing_rooms_count > 0);
ALTER TABLE inspection_report ADD CONSTRAINT chk_inspection_report_cattle_count CHECK (cattle_count >= 0);
ALTER TABLE inspection_report ADD CONSTRAINT chk_inspection_report_small_cattle_count CHECK (small_cattle_count >= 0);
ALTER TABLE inspection_report ADD CONSTRAINT chk_inspection_report_bank_deposits_amount CHECK (bank_deposits_amount IS NULL OR bank_deposits_amount >= 0);

ALTER TABLE inspection_family_member ADD CONSTRAINT chk_inspection_family_member_gender CHECK (gender IN ('M', 'F'));

-- Добавление комментариев к таблицам
COMMENT ON TABLE inspection IS 'Выездные проверки заявлений';
COMMENT ON TABLE inspection_report IS 'Акты выездных проверок условий проживания семьи';
COMMENT ON TABLE inspection_family_member IS 'Члены семьи для акта проверки';
COMMENT ON TABLE inspection_photo IS 'Фотографии выездных проверок';

-- Добавление комментариев к ключевым полям
COMMENT ON COLUMN inspection.status IS 'Статус проверки: ASSIGNED, PREPARATION, IN_PROGRESS, COMPLETED, CANCELLED, REPEAT';
COMMENT ON COLUMN inspection.type IS 'Тип проверки: PRIMARY, REPEAT, COMPLAINT';
COMMENT ON COLUMN inspection_report.regional_status IS 'Региональный статус территории: HIGH_MOUNTAIN, REMOTE, BORDER, OTHER';
COMMENT ON COLUMN inspection_report.housing_type IS 'Тип жилья: HOUSE, APARTMENT, RENTAL, DORMITORY, OTHER';
COMMENT ON COLUMN inspection_report.meets_criteria IS 'Соответствие критериям: YES, NO, REQUIRES_ADDITIONAL_CHECK';
