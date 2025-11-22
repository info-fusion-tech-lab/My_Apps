(() => {
    const APPS_JSON = './apps.json'; // relative to index.html

    // Updated fallback with creator info
    const fallbackApps = [
        { 
            id: 'app-1', 
            name: 'calculator', 
            icon: 'https://via.placeholder.com/56/06b6d4/ffffff?text=A1', 
            url: 'apps/app-1/index.html',
            creator: {
                name: 'lingaraj_sa',
                instagram: 'https://www.instagram.com/_lingaraj_sa_'
            }
        },
        { 
            id: 'app-2', 
            name: 'notes', 
            icon: 'https://via.placeholder.com/56/10b981/ffffff?text=A2', 
            url: 'apps/app-2/index.html',
            creator: {
                name: 'lingaraj_sa',
                instagram: 'https://www.instagram.com/_lingaraj_sa_'
            }
        },
        { 
            id: 'app-3', 
            name: 'weather', 
            icon: 'https://via.placeholder.com/56/ef4444/ffffff?text=A3', 
            url: 'apps/app-3/index.html',
            creator: {
                name: 'lingaraj_sa',
                instagram: 'https://www.instagram.com/_lingaraj_sa_'
            }
        }
    ];

    const grid = document.querySelector('.grid');
    const homeApp = document.getElementById('homeApp');
    const appOpener = document.getElementById('appOpener');
    const backBtn = document.getElementById('backBtn');
    const previewFrame = document.getElementById('preview');
    const headerInfo = document.querySelector('.header-info');
    const currentAppName = document.getElementById('currentAppName');
    const creatorName = document.getElementById('creatorName');
    const creatorLink = document.getElementById('creatorLink');

    function mkCard(app) {
        const a = document.createElement('a');
        a.className = 'card';
        a.href = app.url;
        a.title = app.name;
        a.setAttribute('data-app', JSON.stringify(app));

        const img = document.createElement('img'); 
        img.src = app.icon; 
        img.alt = app.name + ' icon'; 
        a.appendChild(img); 

        const d = document.createElement('div'); 
        d.className = 'name'; 
        d.textContent = app.name; 
        a.appendChild(d); 

        a.addEventListener('click', function(e) { 
            e.preventDefault(); 
            e.stopPropagation(); 
            
            // Get app data
            const appData = JSON.parse(this.getAttribute('data-app'));
            
            // UI switch
            homeApp.classList.add('hidden');
            appOpener.classList.add('active');
            backBtn.style.display = 'block';
            
            // Load iframe
            const appUrl = this.getAttribute('href');
            previewFrame.src = appUrl;
            
            // Update header and preview header
            headerInfo.textContent = 'app : ' + appData.name;
            currentAppName.textContent = appData.name;
            
            // Update creator info
            if (appData.creator) {
                creatorName.textContent = appData.creator.name;
                creatorLink.href = appData.creator.instagram;
            } else {
                // Default creator info
                creatorName.textContent = 'lingaraj_sa';
                creatorLink.href = 'https://www.instagram.com/_lingaraj_sa_';
            }
        }); 

        return a;
    }

    function renderApps(list) {
        grid.innerHTML = '';
        if (!Array.isArray(list) || list.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted)">no apps available</div>';
            return;
        }
        list.forEach(app => grid.appendChild(mkCard(app)));
    } 

    backBtn.addEventListener('click', function() {
        appOpener.classList.remove('active');
        homeApp.classList.remove('hidden');
        backBtn.style.display = 'none';
        previewFrame.src = 'about:blank';
        headerInfo.textContent = 'click app to open';
        currentAppName.textContent = 'App Name';
        
        // Reset creator info
        creatorName.textContent = 'Creator';
        creatorLink.href = '#';
    });

    async function loadFromJsonOrFallback() {
        // Try fetch first (works when served over http/https)
        try {
            const res = await fetch(APPS_JSON + '?_=' + Date.now());
            if (!res.ok) throw new Error('status ' + res.status);
            const apps = await res.json();
            if (!Array.isArray(apps)) throw new Error('apps.json must be an array');
            renderApps(apps);
            return;
        } catch (err) {
            // Fetch failed (likely file:// or missing file) — fall back to constant
            console.warn('loadFromJsonOrFallback — fetch failed, using fallbackApps', err);
            renderApps(fallbackApps);
        }
    }

    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Start
    loadFromJsonOrFallback();
})();