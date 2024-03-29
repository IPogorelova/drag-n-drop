let dropArea = document.getElementById('drop-area');
let previewList = document.querySelector('ul.previews');
const validExtensions = ["jpg", "jpeg", "png", "webp", "gif"];

function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    dropArea.classList.add('js-highlight')
}

function unhighlight(e) {
    dropArea.classList.remove('js-highlight')
}

function uploadFile(file) {
// upload images to server
//     let url = 'ВАШ URL ДЛЯ ЗАГРУЗКИ ФАЙЛОВ';
//     let formData = new FormData();
//     formData.append('file', file);
//     fetch(url, {
//         method: 'POST',
//         body: formData
//     })
//         .then(() => { /* Готово. Информируем пользователя */ })
//         .catch(() => { /* Ошибка. Информируем пользователя */ })
//     readURL(file);
    let fileType = file.type.split('/');
    if (validExtensions.indexOf(fileType[fileType.length -1]) !== -1) {
        createLi(file);
    }
}

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files);
}

function handleFiles(files) {
    ([...files]).forEach(uploadFile);
}

function createLi(file) {
    const li = '<li class="previews__item">' +
        '<button class="delete-btn previews__delete-btn">x</button>' +
        '<div class="previews__img">' +
        '   <img src="#" alt="preview image">' +
        '</div></li>';
    previewList.insertAdjacentHTML('afterbegin', `${li}`);

    const img = previewList.querySelector('li:first-of-type img');
    const reader = new FileReader();
    reader.onload = function (e) {
        img.setAttribute('src', e.target.result);
    };

    const deleteBtn = img.parentNode.parentNode.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function (e) {
        preventDefaults(e);
        deleteBtn.parentElement.parentElement.removeChild(deleteBtn.parentNode);
    });

    reader.readAsDataURL(file);
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
});
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
});

dropArea.addEventListener('drop', handleDrop, false);


//DRAGGABLE lib
new Sortable.default(document.querySelectorAll('ul'), {
    draggable: 'li'
});
