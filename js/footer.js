function cargarFooter() {
    const marcadorFooter = document.getElementById('footer-placeholder');

    if (marcadorFooter) {
        fetch('components/footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                marcadorFooter.innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                marcadorFooter.innerHTML = '<p>Error loading footer.</p>';
            });
    }
}

document.addEventListener('DOMContentLoaded', cargarFooter);
