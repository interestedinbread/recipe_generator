window.addEventListener('DOMContentLoaded', () => {
    const loadPage = async () => {
        const contentContainer = document.querySelector('ejs-content-container');

        try {
            const response = await fetch(url);
            if(!response.ok) throw new Error('Failed to load page');

            const html = await response.text();
            contentContainer.innerHTML = html;

            history.pushState(null, "", url);
        } catch (err){
            console.error("Error loading page", err)
        }
    }

    document.addEventListener('click', async (e) => {
        if(e.target.matches('.go-to-login-btn')){
            e.preventDefault;
            await loadPage('/');
        }
        if(e.target.matches('.go-to-register-btn')){
            e.preventDefault;
            await loadPage('/register');
        }
    })
})