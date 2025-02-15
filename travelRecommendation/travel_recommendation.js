(async () => {
    const response = await fetch('./travel_recommendation_api.json', {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const serverData = await response.json();

    const data = [];
    const appendData = (serverElement, meta) => {
        data.push({
            name: serverElement.name,
            imageUrl: serverElement.imageUrl,
            description: serverElement.description,
            meta: `${meta} ${serverElement.name} ${serverElement.description}`.toLowerCase()
        });
    };
    for (const category in serverData) {
        switch (category) {
            case 'beaches':
            case 'temples':
                for (const element of serverData[category]) {
                    appendData(element, category);
                }
                break;
            case 'countries':
                for (const state of serverData[category]) {
                    for (const city of state.cities) {
                        appendData(city, `${category} cities`);
                    }
                }
                break;
            default:
                console.warn(`Unrecognized category ${category}.`);
        }
    }

    const searchText = document.getElementById('search-text');

    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', async () => {
        const text = searchText.value.toLowerCase();
        const keywords = text.split(/(\s+)/);
        const foundItems = [];
        for (let item of data) {
            let valid = true;
            for (let keyword of keywords) {
                if (item.meta.indexOf(keyword) < 0) {
                    valid = false;
                    break;
                }
            }
            if (!valid) {
                continue;
            }
            if (foundItems.some(e => item.meta === e.meta)) {
                continue;
            }
            foundItems.push(item);
            if (foundItems.length > 3) {
                break;
            }
        }

        const searchResults = document.getElementById('search-results');
        searchResults.innerHTML = '';

        if (foundItems.length === 0) {
          const noResultsTemplate = document.getElementById('no-results-template');
          searchResults.innerHTML = noResultsTemplate.innerHTML;
        } else {
          const yesResultsTemplate = document.getElementById('yes-results-template');
          const templateHtml = yesResultsTemplate.innerHTML;
          let resultsHtml = '';
          for (const item of foundItems) {
            const itemHtml = templateHtml
              .replace('{title}', item.name)
              .replace('{picture}', item.imageUrl)
              .replace('{description}', item.description);
            resultsHtml += itemHtml;
          }
          searchResults.innerHTML = resultsHtml;
        }

        searchResults.style.display = '';

        const homePage = document.getElementById('home-page');
        homePage.style.display = 'none';
    });

    const clearButton = document.getElementById('clear-button');
    clearButton.addEventListener('click', () => {
        searchText.value = '';

        const searchResults = document.getElementById('search-results');
        searchResults.style.display = 'none';

        const homePage = document.getElementById('home-page');
        homePage.style.display = '';
    });
})();
