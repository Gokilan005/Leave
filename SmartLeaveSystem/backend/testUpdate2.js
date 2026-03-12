async function run() {
    try {
        const loginRes = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'gokilanthangavel@gmail.com', password: 'gok' })
        });

        const loginData = await loginRes.json();
        if (!loginData.token) {
            console.log('Login failed', loginData);
            return;
        }

        console.log('Login successful! Testing update...');
        const updateRes = await fetch('http://localhost:5001/api/auth/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}`
            },
            body: JSON.stringify({ name: 'Gokilan T', department: 'CSBS', rollNo: '69AE97EC', phone: '9597993719' })
        });

        console.log('Update Status:', updateRes.status);
        const updateData = await updateRes.json();
        console.log('Update Response:', updateData);

    } catch (err) {
        console.error('Fetch error:', err);
    }
}
run();
