const mongoose = require('mongoose');
const fs = require('fs');

async function debug() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/student_portal');
        console.log('Connected to student_portal');
        
        const db = mongoose.connection.db;
        const users = await db.collection('users').find({}).toArray();
        const clubs = await db.collection('clubs').find({}).toArray();
        const requests = await db.collection('joinrequests').find({}).toArray();
        
        let report = '--- USERS ---\n';
        users.forEach(u => report += `${u.email} | ${u._id} | joinedClubs: ${JSON.stringify(u.joinedClubs)}\n`);
        
        report += '\n--- CLUBS ---\n';
        clubs.forEach(c => report += `${c.name} | ${c._id} | members: ${JSON.stringify(c.members)}\n`);
        
        report += '\n--- REQUESTS ---\n';
        requests.forEach(r => report += `${r.email} | status: ${r.status} | clubId: ${r.clubId} | clubName: ${r.clubName}\n`);
        
        fs.writeFileSync('debug_report.txt', report);
        console.log('Report written to debug_report.txt');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
