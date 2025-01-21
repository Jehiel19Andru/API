// Función que se ejecuta cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    fetchNotebooksList();
});

// Función para obtener la lista de notebooks desde la API
function fetchNotebooksList() {
    fetch('documentos')
        .then(response => response.json())
        .then(data => {
            const notebooksList = document.getElementById('notebooks-list');
            notebooksList.innerHTML = ''; // Limpiar la lista antes de agregar los items

            if (data.length === 0) {
                notebooksList.innerHTML = '<li>No se encontraron archivos .ipynb</li>';
                return;
            }

            // Agregar cada archivo a la lista
            data.forEach(notebook => {
                const li = document.createElement('li');
                li.textContent = notebook;
                li.onclick = () => fetchNotebookContent(notebook);
                notebooksList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error al obtener la lista de notebooks:', error);
        });
}

// Función para obtener el contenido de un notebook
function fetchNotebookContent(notebookName) {
    fetch(`documentos/contenido/${notebookName}`)
        .then(response => response.json())
        .then(data => {
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = ''; // Limpiar contenido previo

            // Mostrar únicamente las salidas de las celdas de código que son imágenes
            data.forEach(cell => {
                if (cell.salidas && cell.salidas.length > 0) {
                    const cellDiv = document.createElement('div');
                    cellDiv.classList.add('cell'); // Agregar clase para estilo (opcional)

                    // Renderizar solo las salidas de tipo imagen
                    cell.salidas.forEach(salida => {
                        if (salida.tipo === 'imagen') {
                            cellDiv.innerHTML += `
                                <img src="data:image/png;base64,${salida.contenido}" alt="Imagen de salida" class="output-image"/>
                            `;
                        }
                    });

                    contentDiv.appendChild(cellDiv);
                }
            });

            if (contentDiv.innerHTML === '') {
                contentDiv.innerHTML = '<p>No hay salidas de imagen en este notebook.</p>';
            }
        })
        .catch(error => {
            console.error('Error al obtener el contenido del notebook:', error);
        });
}