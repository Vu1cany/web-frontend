document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const photoContainer = document.getElementById('photo-container');
    const preloader = document.getElementById('preloader');
    const errorMessage = document.getElementById('error-message');
    const closeModalButton = document.getElementById('modal-close');
    const prevPhotoButton = document.getElementById('prev-photo');
    const photoNumber = document.getElementById('photo-number')
    const nextPhotoButton = document.getElementById('next-photo');

    let photos = [];
    let currentPhotoIndex = 0;

    document.querySelectorAll('.catalog_item').forEach((item, index) => {
        item.setAttribute('data-car-id', index + 1);
        item.addEventListener('click', () => openModal(index + 1, item.querySelector('h3').textContent));
    });

    closeModalButton.addEventListener('click', closeModal);
    prevPhotoButton.addEventListener('click', () => navigatePhoto(-1));
    nextPhotoButton.addEventListener('click', () => navigatePhoto(1));

    function openModal(carId, name) {
        modal.style.display = 'flex';
        modalTitle.textContent = `${name}`;
        photoContainer.innerHTML = '';
        preloader.style.display = 'block';
        errorMessage.style.display = 'none';
        prevPhotoButton.style.display = 'none'
        nextPhotoButton.style.display = 'none'

        fetchPhotos(carId)
            .then(data => {
                photos = data.slice(0, 3);
                currentPhotoIndex = 0;
                displayPhoto();
                preloader.style.display = 'none';
                prevPhotoButton.style.display = 'block'
                nextPhotoButton.style.display = 'block'
            })
            .catch(() => {
                preloader.style.display = 'none';
                prevPhotoButton.style.display = 'none'
                nextPhotoButton.style.display = 'none'
                errorMessage.style.display = 'block';
            });
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function fetchPhotos(carId) {
        const albumId = carId;
        const endpoint = `https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`;
        return fetch(`${endpoint}`)
            .then(response => {
                if (!response.ok) throw new Error('Ошибка запроса');
                return response.json();
            });
    }

    function displayPhoto() {
        photoContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = photos[currentPhotoIndex].url;
        img.alt = photos[currentPhotoIndex].title;
        photoContainer.appendChild(img);
        photoNumber.textContent = `${currentPhotoIndex + 1}`
    }

    function navigatePhoto(direction) {
        currentPhotoIndex = (currentPhotoIndex + direction + photos.length) % photos.length;
        displayPhoto();
    }
});
