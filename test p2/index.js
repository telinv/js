
async function requestServer() {
    const formLog = document.querySelector('.input__tel').value;
    const formPass = document.querySelector('.input__password').value;
    const btnEnter = document.querySelector('.btn__enter');
    const loader = document.getElementById('loader');
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');
    const loginForm = document.getElementById('login-form');

    errorDiv.textContent = '';
    successDiv.textContent = '';

    const validLogins = ['hr@samedia.ru', '+7 (863) 303-36-65'];
    const validPassword = 'q10O57H25O82E40y95D12a85U96A4U34';

    if (!validLogins.includes(formLog) || formPass !== validPassword) {
        errorDiv.textContent = 'Неправильный логин или пароль';
        return;
    }else{
        successDiv.textContent = 'Добро пожаловать!'
    }

    btnEnter.disabled = true;
    loader.style.display = 'block';

    const url = new URL('https://test-works.pr-uni.ru/api/login');
    url.searchParams.append('email_or_phone', formLog);
    url.searchParams.append('password', formPass);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const result = await response.json();

        if (response.ok) {
            document.cookie = `token=${result.token}; path=/;`;
            loginForm.style.display = 'none';
            successDiv.textContent = `${result.user.name}, Вы успешно авторизованы!`;
        } else {
            errorDiv.textContent = result.message || 'Ошибка авторизации';
        }
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            errorDiv.textContent = 'Ошибка сети или проблемы с CORS';
        } else {
            errorDiv.textContent = 'Ошибка: ' + error.message;
        }
    } finally {
        btnEnter.disabled = false;
        loader.style.display = 'none';
    }
}

document.querySelector('.btn__enter').addEventListener('click', requestServer);
