// Variable global para almacenar los datos del perfil
let profileData = {};

// Función para obtener el ID del colaborador de la URL
function getCollaboratorIdFromURL() {
    // Intentar obtener de los parámetros de consulta
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');
    
    if (idParam) {
        return idParam;
    }
    
    // Si no se encuentra en ningún lugar, devolver un ID predeterminado
    return "rcamayop";
}

// Función para cargar datos desde el archivo JSON
async function loadProfileDataFromJSON() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        // Obtener el ID del colaborador de la URL
        const collaboratorId = getCollaboratorIdFromURL();
        
        // Buscar el colaborador con ese ID
        const collaborator = data.colaboradores.find(c => c.id === collaboratorId);
        
        if (collaborator) {
            return collaborator;
        } else {
            console.warn(`Colaborador con ID ${collaboratorId} no encontrado, usando el primero disponible`);
            return data.colaboradores[0];
        }
    } catch (error) {
        console.error('Error al cargar los datos del perfil:', error);
        // Datos de respaldo en caso de error
        return {
            "id": "rcamayop",
            "estado": "Activo",
            "cargo": "Gerente de Administración",
            "nombres": "Rafael Camayo Piñas",
            "telefono": "+51964879137",
            "email": "rcamayo@cajahuancayo.com.pe",
            "whatsapp": "+51964879137",
            "url_website": "https://www.cajahuancayo.com.pe/",
            "foto_id": "rafael",
            "redes_sociales": {
                "linkedin": "https://pe.linkedin.com/in/rafael-camayo-piñas",
                "facebook": "https://www.facebook.com/CajaHuancayo",
                "tiktok": "https://www.tiktok.com/@cajahuancayo"
            }
        };
    }
};

// Función para cargar datos dinámicamente
async function loadProfileData() {
    // Obtener datos del JSON
    profileData = await loadProfileDataFromJSON();
    
    // Cargar foto de perfil
    document.getElementById('profile-picture').src = `img/fotos/${profileData.foto_id}.jpg`;
    
    // Cargar nombre y cargo
    document.getElementById('profile-name').textContent = profileData.nombres;
    document.getElementById('profile-position').textContent = profileData.cargo;
    
    // Verificar el estado del colaborador
    if (profileData.estado && profileData.estado.toLowerCase() === 'inactivo') {
        // Crear y mostrar mensaje de inactividad
        const inactiveMessage = document.createElement('div');
        inactiveMessage.className = 'inactive-message';
        inactiveMessage.innerHTML = '<p>La persona ya no trabaja en nuestra empresa</p>';
        
        // Insertar el mensaje después del cargo
        const positionElement = document.getElementById('profile-position');
        positionElement.parentNode.insertBefore(inactiveMessage, positionElement.nextSibling);
        
        // Añadir estilo para el mensaje
        const style = document.createElement('style');
        style.textContent = `
            .inactive-message {
                background-color: rgba(226, 0, 26, 0.1);
                color: #E2001A;
                padding: 8px 12px;
                border-radius: 4px;
                margin: 10px 0;
                font-size: 0.9rem;
                font-weight: 500;
                text-align: center;
                border-left: 3px solid #E2001A;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Cargar información de contacto
    const phoneElement = document.getElementById('profile-phone');
    phoneElement.href = `tel:${profileData.telefono}`;
    phoneElement.textContent = profileData.telefono;
    
    const emailElement = document.getElementById('profile-email');
    emailElement.href = `mailto:${profileData.email}`;
    emailElement.textContent = profileData.email;
    
    const websiteElement = document.getElementById('profile-website');
    websiteElement.href = profileData.url_website;
    websiteElement.textContent = profileData.url_website.replace(/^https?:\/\//i, '');
    
    // Cargar enlaces de redes sociales
    const whatsappElement = document.getElementById('profile-whatsapp');
    whatsappElement.href = `https://wa.me/${profileData.whatsapp.replace(/[+\s]/g, '')}`;
    
    // Cargar redes sociales si existen
    if (profileData.redes_sociales) {
        if (profileData.redes_sociales.linkedin) {
            document.getElementById('profile-linkedin').href = profileData.redes_sociales.linkedin;
        } else {
            document.getElementById('profile-linkedin').style.display = 'none';
        }
        
        if (profileData.redes_sociales.facebook) {
            document.getElementById('profile-facebook').href = profileData.redes_sociales.facebook;
        } else {
            document.getElementById('profile-facebook').style.display = 'none';
        }
        
        if (profileData.redes_sociales.tiktok) {
            document.getElementById('profile-tiktok').href = profileData.redes_sociales.tiktok;
        } else {
            document.getElementById('profile-tiktok').style.display = 'none';
        }
    }
    
    // Generar código QR
    generateQRCode(profileData.id);
}

// Función para generar el código QR con la URL de la tarjeta
function generateQRCode(collaboratorId) {
    try {
        // Obtener el elemento contenedor del QR
        const qrCodeElement = document.getElementById('qr-code');
        
        // Verificar si el elemento existe
        if (!qrCodeElement) {
            console.error('El elemento con ID "qr-code" no existe en el documento');
            return;
        }
        
        // Limpiar el contenedor antes de generar un nuevo QR
        qrCodeElement.innerHTML = '';
        
        // Construir la URL completa con el formato ?id=[id]
        const currentUrl = window.location.href.split('?')[0]; // Obtener la URL base sin parámetros
        const fullUrl = `${currentUrl}?id=${collaboratorId}`;
        
        // Generar el código QR
        new QRCode(qrCodeElement, {
            text: fullUrl,
            width: 150,
            height: 150,
            colorDark: "#444444",  // Azul oscuro
            colorLight: "#F5F5F5",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        console.log("QR generado correctamente con la URL:", fullUrl);
    } catch (error) {
        console.error("Error al generar el QR:", error);
    }
}

// Función para cargar datos de un colaborador específico por ID
async function loadCollaboratorData(collaboratorId) {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const collaborator = data.colaboradores.find(c => c.id === collaboratorId);
        
        if (collaborator) {
            profileData = collaborator;
            // Actualizar la interfaz con los nuevos datos
            document.getElementById('profile-picture').src = `img/fotos/${profileData.foto_id}.jpg`;
            document.getElementById('profile-name').textContent = profileData.nombres;
            document.getElementById('profile-position').textContent = profileData.cargo;
            
            const phoneElement = document.getElementById('profile-phone');
            phoneElement.href = `tel:${profileData.telefono}`;
            phoneElement.textContent = profileData.telefono;
            
            const emailElement = document.getElementById('profile-email');
            emailElement.href = `mailto:${profileData.email}`;
            emailElement.textContent = profileData.email;
            
            const websiteElement = document.getElementById('profile-website');
            websiteElement.href = `https://${profileData.url_website}`;
            websiteElement.textContent = profileData.url_website;
            
            const whatsappElement = document.getElementById('profile-whatsapp');
            whatsappElement.href = `https://wa.me/${profileData.whatsapp.replace(/[+\s]/g, '')}`;
            
            // Actualizar redes sociales
            updateSocialLinks();
            
            // Regenerar código QR
            document.getElementById('qrcode').innerHTML = '';
            generateQRCode();
            
            return true;
        } else {
            console.error(`Colaborador con ID ${collaboratorId} no encontrado`);
            return false;
        }
    } catch (error) {
        console.error('Error al cargar los datos del colaborador:', error);
        return false;
    }
}

// Función para actualizar los enlaces de redes sociales
function updateSocialLinks() {
    if (profileData.redes_sociales) {
        if (profileData.redes_sociales.linkedin) {
            document.getElementById('profile-linkedin').href = profileData.redes_sociales.linkedin;
            document.getElementById('profile-linkedin').style.display = '';
        } else {
            document.getElementById('profile-linkedin').style.display = 'none';
        }
        
        if (profileData.redes_sociales.facebook) {
            document.getElementById('profile-facebook').href = profileData.redes_sociales.facebook;
            document.getElementById('profile-facebook').style.display = '';
        } else {
            document.getElementById('profile-facebook').style.display = 'none';
        }
        
        if (profileData.redes_sociales.tiktok) {
            document.getElementById('profile-tiktok').href = profileData.redes_sociales.tiktok;
            document.getElementById('profile-tiktok').style.display = '';
        } else {
            document.getElementById('profile-tiktok').style.display = 'none';
        }
    }
}

// Función para permitir la descarga de la vCard
function createDownloadableVCard() {
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
N:${profileData.nombres.split(' ').slice(-1)[0]};${profileData.nombres.split(' ').slice(0, -1).join(' ')}
FN:${profileData.nombres}
TITLE:${profileData.cargo}
ORG:Caja Huancayo
TEL;TYPE=WORK,VOICE:${profileData.telefono}
EMAIL;TYPE=WORK:${profileData.email}
URL:https://${profileData.url_website}
END:VCARD`;

    const blob = new Blob([vCardContent], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${profileData.nombres.replace(/\s+/g, '_')}.vcf`;
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Verificar si la biblioteca QR está cargada
function isQRLibraryLoaded() {
    return typeof QRCode !== 'undefined';
}

// Cargar la biblioteca QR si no está disponible
function loadQRLibrary() {
    return new Promise((resolve, reject) => {
        if (isQRLibraryLoaded()) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('No se pudo cargar la biblioteca QR'));
        document.head.appendChild(script);
    });
}

// Cargar datos cuando la página esté lista
document.addEventListener('DOMContentLoaded', async () => {
    // Intentar cargar la biblioteca QR si no está disponible
    try {
        await loadQRLibrary();
    } catch (error) {
        console.error('Error al cargar la biblioteca QR:', error);
    }
    
    await loadProfileData();
    
    // Añadir funcionalidad para descargar la vCard al hacer clic en el QR
    document.getElementById('qrcode').addEventListener('click', createDownloadableVCard);
    
    // Añadir efectos visuales
    const card = document.querySelector('.card');
    
    // Efecto de profundidad 3D al mover el mouse (solo en dispositivos no táctiles)
    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) translateY(-5px)`;
        });
        
        // Restaurar la posición cuando el mouse sale
        document.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    }
    
    // Añadir selector de colaborador (para demostración)
    const urlParams = new URLSearchParams(window.location.search);
    const collaboratorId = urlParams.get('id');
    
    if (collaboratorId) {
        loadCollaboratorData(collaboratorId);
    }
    
    // Crear selector de colaboradores
    createCollaboratorSelector();
});



