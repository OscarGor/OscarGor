-- 創建比賽表
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    match_code VARCHAR(20) UNIQUE NOT NULL, -- 如 FB3200
    home_team VARCHAR(100) NOT NULL,
    away_team VARCHAR(100) NOT NULL,
    competition_type VARCHAR(50),
    match_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 奇門信息表
CREATE TABLE qimen_data (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id),
    palace VARCHAR(20), -- 宮位: 兌宮, 乾宮等
    celestial_stems JSONB, -- 天干信息
    earthly_branches JSONB, -- 地支信息
    door VARCHAR(20), -- 八門
    star VARCHAR(20), -- 九星
    deity VARCHAR(20), -- 八神
    patterns JSONB, -- 格局組合
    special_info TEXT, -- 四害等信息
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 預測結果表
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id),
    ai_version VARCHAR(10), -- V5.1I等
    half_time_prediction VARCHAR(10), -- 半場預測
    full_time_prediction VARCHAR(10), -- 全場預測
    technical_prediction JSONB, -- 技術指標預測
    confidence_score DECIMAL(5,2),
    prediction_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 實際賽果表
CREATE TABLE actual_results (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id),
    half_time_score VARCHAR(10),
    full_time_score VARCHAR(10),
    technical_data JSONB,
    verification_status VARCHAR(20) DEFAULT 'pending',
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI參數版本表
CREATE TABLE ai_parameters (
    id SERIAL PRIMARY KEY,
    version VARCHAR(10) UNIQUE NOT NULL,
    parameters JSONB NOT NULL,
    accuracy_score DECIMAL(5,2),
    matches_tested INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 奇門格局統計庫
CREATE TABLE pattern_statistics (
    id SERIAL PRIMARY KEY,
    pattern_code VARCHAR(50), -- 格局代碼，如"乙+庚"
    pattern_name VARCHAR(100),
    occurrence_count INTEGER DEFAULT 0,
    success_cases INTEGER DEFAULT 0,
    failure_cases INTEGER DEFAULT 0,
    accuracy_rate DECIMAL(5,2),
    average_impact DECIMAL(5,2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);