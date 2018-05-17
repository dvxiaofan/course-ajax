(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;
        // 添加图片
        var imgRequest = new XMLHttpRequest();
        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imgRequest.onload = addImage;
        imgRequest.setRequestHeader('Authorization', 'Client-ID 141d3d9618be5f6fa1e1d32dea90787350f9274a51a9682eda7a2c0e2a570fbd');

        imgRequest.send();

        // 添加文章
        var articleRequest = new XMLHttpRequest();
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=9ff44f221b134b42a8f25ee15a006df6`);
        articleRequest.onload = addArticles;

        articleRequest.send();

    });

    function addImage() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if (data && data.results && data.results[0]) {
            const firstImg = data.results[0];
            htmlContent = `<figure>
                <img src="${firstImg.urls.regular} alt="${searchedForText}">
                <figcapiton>${searchedForText} by ${firstImg.user.name}</figcapiton>
            </figure>`;
        } else {
            htmlContent = `<div class="error-no-image">No Images To Show</div>`;
        }
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if (data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
                <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                <p>${article.snippet}</p>
            </li>`).join('') + '</ul>';
        } else {
            htmlContent = `<div class="error-no-articles">No Articles To Show</div>`;
        }
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }

})();
