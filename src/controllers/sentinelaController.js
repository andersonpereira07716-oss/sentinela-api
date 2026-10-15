const fs = require('fs');
const path = require('path');
const supabase = require('../config/supabase');

const dbPath = path.join(__dirname, '../../database.json');

const readLocalDb = () => {
    if (!fs.existsSync(dbPath)) {
        return { journeys: [], history: [], contacts: [] };
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
};

const writeLocalDb = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

exports.getStatus = (req, res) => {
    res.json({ status: 'online', database: supabase ? 'Supabase Cloud' : 'Local JSON' });
};

exports.saveJourney = async (req, res) => {
    try {
        const journeyData = req.body;
        
        if (supabase) {
            const { data, error } = await supabase.from('journeys').insert([journeyData]);
            if (error) throw error;
            return res.json({ success: true, source: 'supabase', data });
        }

        const db = readLocalDb();
        db.journeys.push(journeyData);
        writeLocalDb(db);
        res.json({ success: true, source: 'local', data: journeyData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        if (supabase) {
            const { data, error } = await supabase.from('journeys').select('*');
            if (error) throw error;
            return res.json(data);
        }

        const db = readLocalDb();
        res.json(db.journeys);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
