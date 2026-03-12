const http = require('http');

const loginData = JSON.stringify({ email: 'gokilanthangavel@gmail.com', password: 'gok' }); // Adjust if needed

const req = http.request('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
    }
}, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("LOGIN RESPONSE: " + data);
        const json = JSON.parse(data);
        if (!json.token) {
            console.log('Login failed');
            return;
        }

        const updateData = JSON.stringify({ name: 'Gokilan', department: 'CSBS', rollNo: '69AE97EC', phone: '9597993719' });
        const updateReq = http.request('http://localhost:5001/api/auth/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + json.token,
                'Content-Length': updateData.length
            }
        }, updateRes => {
            let uData = '';
            updateRes.on('data', chunk => uData += chunk);
            updateRes.on('end', () => {
                console.log('Update Status:', updateRes.statusCode);
                console.log('Update Body:', uData);
            });
        });

        updateReq.on('error', err => console.error(err));
        updateReq.write(updateData);
        updateReq.end();
    });
});

req.on('error', err => console.error(err));
req.write(loginData);
req.end();
