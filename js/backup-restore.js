document.addEventListener('DOMContentLoaded', function() {
    const backupButton = document.getElementById('backupButton');
    const restoreFile = document.getElementById('restoreFile');
    const restoreButton = document.getElementById('restoreButton');

    backupButton.addEventListener('click', async function() {
        try {
            const response = await fetch('http://localhost:3000/api/backup', {
                headers: {
                    'Authorization': localStorage.getItem('adminToken')
                }
            });
            if (response.ok) {
                const data = await response.json();
                const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'timeline_backup.json';
                a.click();
                URL.revokeObjectURL(url);
            } else {
                throw new Error('Backup failed');
            }
        } catch (error) {
            console.error('Error during backup:', error);
            alert('حدث خطأ أثناء النسخ الاحتياطي. يرجى المحاولة مرة أخرى.');
        }
    });

    restoreButton.addEventListener('click', async function() {
        if (!restoreFile.files.length) {
            alert('الرجاء اختيار ملف لاستعادة البيانات');
            return;
        }

        const file = restoreFile.files[0];
        const reader = new FileReader();

        reader.onload = async function(e) {
            try {
                const data = JSON.parse(e.target.result);
                const response = await fetch('http://localhost:3000/api/restore', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('adminToken')
                    },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    alert('تمت استعادة البيانات بنجاح');
                } else {
                    throw new Error('Restore failed');
                }
            } catch (error) {
                console.error('Error during restore:', error);
                alert('حدث خطأ أثناء استعادة البيانات. يرجى المحاولة مرة أخرى.');
            }
        };

        reader.readAsText(file);
    });
});
