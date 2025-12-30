// ============================================
// 导航功能实现
// ============================================

// 获取所有导航链接和区域
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// 导航链接点击事件
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 获取目标区域的ID
        const targetId = link.getAttribute('href').substring(1);
        
        // 移除所有活动状态
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        // 添加活动状态到当前链接和目标区域
        link.classList.add('active');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // 移动端：关闭菜单
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
        }
        
        // 平滑滚动到顶部（因为使用固定导航栏）
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// 汉堡菜单切换
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// 点击菜单外部关闭菜单（移动端）
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    }
});

// ============================================
// 页面加载时的初始化
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // 默认显示首页
    const homeSection = document.getElementById('home');
    const homeLink = document.querySelector('a[href="#home"]');
    
    if (homeSection && homeLink) {
        homeSection.classList.add('active');
        homeLink.classList.add('active');
    }
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// 滚动效果增强
// ============================================

// 监听滚动事件，实现导航栏阴影效果
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(74, 144, 226, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(74, 144, 226, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// 卡片动画效果（滚动时显示）
// ============================================

// 创建 Intersection Observer 来检测元素是否进入视口
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // 如果是时间轴项，添加visible类
            if (entry.target.classList.contains('timeline-item')) {
                entry.target.classList.add('visible');
            }
        }
    });
}, observerOptions);

// 为所有卡片添加观察
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.about-card, .skill-card, .hobby-card, .contact-card');
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // 为时间轴项添加观察
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        // 添加延迟，让时间轴项依次出现
        item.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(item);
    });
});

// ============================================
// 窗口大小改变时的处理
// ============================================

window.addEventListener('resize', () => {
    // 如果窗口变大，确保菜单显示正常
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
    }
});

// ============================================
// 邮箱链接点击效果
// ============================================

const emailLink = document.querySelector('a[href^="mailto:"]');
if (emailLink) {
    emailLink.addEventListener('click', (e) => {
        // 添加点击反馈
        emailLink.style.transform = 'scale(0.95)';
        setTimeout(() => {
            emailLink.style.transform = 'scale(1)';
        }, 150);
    });
}

// ============================================
// 平滑滚动增强
// ============================================

// 为所有内部链接添加平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            // 导航功能已经在上面处理，这里只处理平滑滚动
            // 由于我们使用的是单页切换，不需要额外的滚动处理
        }
    });
});

// ============================================
// 照片墙功能实现
// ============================================

// 照片存储键名
const GALLERY_STORAGE_KEY = 'personal_website_gallery';

// 获取DOM元素
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const galleryGrid = document.getElementById('galleryGrid');
const galleryEmpty = document.getElementById('galleryEmpty');

// 照片数组
let photos = [];

// 初始化照片墙
function initGallery() {
    // 从localStorage加载照片
    loadPhotosFromStorage();
    
    // 渲染照片
    renderGallery();
    
    // 设置事件监听
    setupGalleryEvents();
}

// 从localStorage加载照片
function loadPhotosFromStorage() {
    try {
        const savedPhotos = localStorage.getItem(GALLERY_STORAGE_KEY);
        if (savedPhotos) {
            photos = JSON.parse(savedPhotos);
        }
    } catch (error) {
        console.error('加载照片失败:', error);
        photos = [];
    }
}

// 保存照片到localStorage
function savePhotosToStorage() {
    try {
        localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(photos));
    } catch (error) {
        console.error('保存照片失败:', error);
        // 如果存储空间不足，提示用户
        if (error.name === 'QuotaExceededError') {
            alert('存储空间不足，请删除一些照片后再试。');
        }
    }
}

// 渲染照片墙
function renderGallery() {
    // 清空现有内容
    galleryGrid.innerHTML = '';
    
    if (photos.length === 0) {
        // 显示空状态
        galleryGrid.appendChild(galleryEmpty);
        galleryEmpty.style.display = 'block';
    } else {
        // 隐藏空状态
        galleryEmpty.style.display = 'none';
        
        // 渲染每张照片
        photos.forEach((photoData, index) => {
            const photoItem = createPhotoItem(photoData, index);
            galleryGrid.appendChild(photoItem);
        });
    }
}

// 创建照片项
function createPhotoItem(photoData, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.index = index;
    
    const img = document.createElement('img');
    img.src = photoData.dataUrl;
    img.alt = '照片';
    img.loading = 'lazy';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.title = '删除照片';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deletePhoto(index);
    };
    
    item.appendChild(img);
    item.appendChild(deleteBtn);
    
    // 点击查看大图
    item.onclick = () => {
        showPhotoModal(photoData.dataUrl);
    };
    
    return item;
}

// 删除照片
function deletePhoto(index) {
    if (confirm('确定要删除这张照片吗？')) {
        photos.splice(index, 1);
        savePhotosToStorage();
        renderGallery();
    }
}

// 显示照片查看模态框
function showPhotoModal(imageSrc) {
    // 创建模态框（如果不存在）
    let modal = document.getElementById('photoModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'photoModal';
        modal.className = 'gallery-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'gallery-modal-content';
        
        const img = document.createElement('img');
        img.id = 'modalImage';
        img.src = '';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'gallery-modal-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => {
            modal.classList.remove('active');
        };
        
        modalContent.appendChild(img);
        modalContent.appendChild(closeBtn);
        modal.appendChild(modalContent);
        
        // 点击背景关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        };
        
        document.body.appendChild(modal);
    }
    
    // 显示照片
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    modal.classList.add('active');
}

// 添加照片
function addPhoto(file) {
    return new Promise((resolve, reject) => {
        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件！');
            reject(new Error('不是图片文件'));
            return;
        }
        
        // 检查文件大小（限制为5MB）
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5MB！');
            reject(new Error('文件过大'));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            const photoData = {
                dataUrl: dataUrl,
                name: file.name,
                size: file.size,
                type: file.type,
                timestamp: Date.now()
            };
            
            photos.push(photoData);
            savePhotosToStorage();
            renderGallery();
            resolve(photoData);
        };
        
        reader.onerror = () => {
            alert('读取文件失败，请重试！');
            reject(new Error('读取失败'));
        };
        
        reader.readAsDataURL(file);
    });
}

// 设置照片墙事件监听
function setupGalleryEvents() {
    // 文件选择
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                addPhoto(file).catch(err => console.error(err));
            });
            // 清空input，允许重复选择同一文件
            fileInput.value = '';
        });
    }
    
    // 拖拽上传
    if (uploadArea) {
        // 阻止默认拖拽行为
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // 拖拽进入
        uploadArea.addEventListener('dragenter', () => {
            uploadArea.classList.add('drag-over');
        });
        
        // 拖拽离开
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        // 拖拽放下
        uploadArea.addEventListener('drop', (e) => {
            uploadArea.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files);
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    addPhoto(file).catch(err => console.error(err));
                }
            });
        });
        
        // 点击上传区域
        uploadArea.addEventListener('click', (e) => {
            if (e.target === uploadArea || uploadArea.contains(e.target)) {
                if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
                    fileInput.click();
                }
            }
        });
    }
    
    // 粘贴图片（Ctrl+V 或 Cmd+V）
    document.addEventListener('paste', (e) => {
        // 检查是否在照片墙页面
        const gallerySection = document.getElementById('gallery');
        if (gallerySection && gallerySection.classList.contains('active')) {
            const items = e.clipboardData.items;
            
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    const file = new File([blob], `粘贴图片_${Date.now()}.png`, { type: blob.type });
                    addPhoto(file).catch(err => console.error(err));
                    break;
                }
            }
        }
    });
}

// 页面加载时初始化照片墙
document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initTravelPhotos();
    initAnimeCollection();
    
    // 更新卡片观察器，包含照片项
    setTimeout(() => {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }, 100);
});

// ============================================
// 动漫收藏功能实现
// ============================================

// 动漫收藏存储键名
const ANIME_COLLECTION_STORAGE_KEY = 'personal_website_anime_collection';

// 获取DOM元素
const animeFileInput = document.getElementById('animeFileInput');
const animeTypeInput = document.getElementById('animeTypeInput');
const animeUploadArea = document.getElementById('animeUploadArea');
const animeCollectionGrid = document.getElementById('animeCollectionGrid');
const animeCollectionEmpty = document.getElementById('animeCollectionEmpty');
const animeCollectionSection = document.getElementById('animeCollectionSection');

// 当前选择的图片（临时存储）
let currentAnimeImage = null;

// 动漫收藏数组
let animeCollection = [];

// 切换动漫收藏显示/隐藏
function toggleAnimeCollection() {
    if (animeCollectionSection) {
        const isVisible = animeCollectionSection.style.display !== 'none';
        animeCollectionSection.style.display = isVisible ? 'none' : 'block';
        
        // 如果显示，确保滚动到该区域
        if (!isVisible) {
            setTimeout(() => {
                animeCollectionSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }
}

// 初始化动漫收藏
function initAnimeCollection() {
    // 从localStorage加载收藏
    loadAnimeCollectionFromStorage();
    
    // 渲染收藏
    renderAnimeCollection();
    
    // 设置事件监听
    setupAnimeCollectionEvents();
}

// 从localStorage加载动漫收藏
function loadAnimeCollectionFromStorage() {
    try {
        const savedCollection = localStorage.getItem(ANIME_COLLECTION_STORAGE_KEY);
        if (savedCollection) {
            animeCollection = JSON.parse(savedCollection);
        }
    } catch (error) {
        console.error('加载动漫收藏失败:', error);
        animeCollection = [];
    }
}

// 保存动漫收藏到localStorage
function saveAnimeCollectionToStorage() {
    try {
        localStorage.setItem(ANIME_COLLECTION_STORAGE_KEY, JSON.stringify(animeCollection));
    } catch (error) {
        console.error('保存动漫收藏失败:', error);
        if (error.name === 'QuotaExceededError') {
            alert('存储空间不足，请删除一些收藏后再试。');
        }
    }
}

// 渲染动漫收藏
function renderAnimeCollection() {
    if (!animeCollectionGrid) return;
    
    // 清空现有内容
    animeCollectionGrid.innerHTML = '';
    
    if (animeCollection.length === 0) {
        // 显示空状态
        if (animeCollectionEmpty) {
            animeCollectionGrid.appendChild(animeCollectionEmpty);
            animeCollectionEmpty.style.display = 'block';
        }
    } else {
        // 隐藏空状态
        if (animeCollectionEmpty) {
            animeCollectionEmpty.style.display = 'none';
        }
        
        // 渲染每个收藏项
        animeCollection.forEach((animeItem, index) => {
            const item = createAnimeItem(animeItem, index);
            animeCollectionGrid.appendChild(item);
        });
    }
}

// 创建动漫收藏项
function createAnimeItem(animeItem, index) {
    const item = document.createElement('div');
    item.className = 'anime-item';
    item.dataset.index = index;
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'anime-item-image';
    
    const img = document.createElement('img');
    img.src = animeItem.imageDataUrl;
    img.alt = animeItem.type;
    img.loading = 'lazy';
    
    imageContainer.appendChild(img);
    
    // 点击查看大图
    imageContainer.onclick = () => {
        showPhotoModal(animeItem.imageDataUrl);
    };
    
    const content = document.createElement('div');
    content.className = 'anime-item-content';
    
    const typeTag = document.createElement('div');
    typeTag.className = 'anime-item-type';
    typeTag.textContent = animeItem.type;
    
    content.appendChild(typeTag);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.title = '删除收藏';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteAnimeItem(index);
    };
    
    item.appendChild(imageContainer);
    item.appendChild(content);
    item.appendChild(deleteBtn);
    
    return item;
}

// 删除动漫收藏项
function deleteAnimeItem(index) {
    if (confirm('确定要删除这个动漫收藏吗？')) {
        animeCollection.splice(index, 1);
        saveAnimeCollectionToStorage();
        renderAnimeCollection();
    }
}

// 添加动漫收藏项
function addAnimeItem() {
    const type = animeTypeInput ? animeTypeInput.value.trim() : '';
    
    if (!type) {
        alert('请输入动漫类型或名称！');
        return;
    }
    
    if (!currentAnimeImage) {
        alert('请先上传图片！');
        return;
    }
    
    const animeItem = {
        type: type,
        imageDataUrl: currentAnimeImage,
        timestamp: Date.now()
    };
    
    animeCollection.push(animeItem);
    saveAnimeCollectionToStorage();
    renderAnimeCollection();
    
    // 清空表单
    clearAnimeForm();
}

// 清空表单
function clearAnimeForm() {
    if (animeTypeInput) {
        animeTypeInput.value = '';
    }
    currentAnimeImage = null;
    
    // 清空文件输入
    if (animeFileInput) {
        animeFileInput.value = '';
    }
    
    // 更新上传区域显示
    if (animeUploadArea) {
        const uploadContent = animeUploadArea.querySelector('.anime-upload-content');
        if (uploadContent) {
            uploadContent.style.display = 'block';
        }
    }
}

// 处理图片选择
function handleAnimeImageSelect(file) {
    return new Promise((resolve, reject) => {
        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件！');
            reject(new Error('不是图片文件'));
            return;
        }
        
        // 检查文件大小（限制为5MB）
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5MB！');
            reject(new Error('文件过大'));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            currentAnimeImage = e.target.result;
            
            // 显示预览
            const uploadContent = animeUploadArea.querySelector('.anime-upload-content');
            if (uploadContent) {
                uploadContent.innerHTML = `
                    <div style="text-align: center;">
                        <img src="${currentAnimeImage}" style="max-width: 100%; max-height: 200px; border-radius: 8px; margin-bottom: 1rem;" alt="预览">
                        <p style="color: var(--text-light); margin-bottom: 0.5rem;">图片已选择</p>
                        <button type="button" class="btn btn-secondary" onclick="clearAnimeForm()">重新选择</button>
                    </div>
                `;
            }
            
            resolve(currentAnimeImage);
        };
        
        reader.onerror = () => {
            alert('读取文件失败，请重试！');
            reject(new Error('读取失败'));
        };
        
        reader.readAsDataURL(file);
    });
}

// 设置动漫收藏事件监听
function setupAnimeCollectionEvents() {
    // 文件选择
    if (animeFileInput) {
        animeFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleAnimeImageSelect(file).catch(err => console.error(err));
            }
        });
    }
    
    // 拖拽上传
    if (animeUploadArea) {
        // 阻止默认拖拽行为
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            animeUploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // 拖拽进入
        animeUploadArea.addEventListener('dragenter', () => {
            animeUploadArea.classList.add('drag-over');
        });
        
        // 拖拽离开
        animeUploadArea.addEventListener('dragleave', () => {
            animeUploadArea.classList.remove('drag-over');
        });
        
        // 拖拽放下
        animeUploadArea.addEventListener('drop', (e) => {
            animeUploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleAnimeImageSelect(file).catch(err => console.error(err));
            }
        });
        
        // 点击上传区域
        animeUploadArea.addEventListener('click', (e) => {
            if (e.target === animeUploadArea || animeUploadArea.contains(e.target)) {
                if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && !e.target.closest('button')) {
                    animeFileInput.click();
                }
            }
        });
    }
    
    // 粘贴图片（Ctrl+V 或 Cmd+V）
    document.addEventListener('paste', (e) => {
        // 检查是否在动漫收藏区域可见
        if (animeCollectionSection && animeCollectionSection.style.display !== 'none') {
            const items = e.clipboardData.items;
            
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    const file = new File([blob], `动漫图片_${Date.now()}.png`, { type: blob.type });
                    handleAnimeImageSelect(file).catch(err => console.error(err));
                    break;
                }
            }
        }
    });
    
    // 回车键提交表单
    if (animeTypeInput) {
        animeTypeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addAnimeItem();
            }
        });
    }
}

// ============================================
// 旅游照片功能实现
// ============================================

// 旅游照片存储键名
const TRAVEL_PHOTOS_STORAGE_KEY = 'personal_website_travel_photos';

// 获取DOM元素
const travelFileInput = document.getElementById('travelFileInput');
const travelUploadArea = document.getElementById('travelUploadArea');
const travelPhotosGrid = document.getElementById('travelPhotosGrid');
const travelPhotosEmpty = document.getElementById('travelPhotosEmpty');
const travelPhotosSection = document.getElementById('travelPhotosSection');

// 旅游照片数组
let travelPhotos = [];

// 切换旅游照片显示/隐藏
function toggleTravelPhotos() {
    if (travelPhotosSection) {
        const isVisible = travelPhotosSection.style.display !== 'none';
        travelPhotosSection.style.display = isVisible ? 'none' : 'block';
        
        // 如果显示，确保滚动到该区域
        if (!isVisible) {
            setTimeout(() => {
                travelPhotosSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }
}

// 初始化旅游照片
function initTravelPhotos() {
    // 从localStorage加载照片
    loadTravelPhotosFromStorage();
    
    // 渲染照片
    renderTravelPhotos();
    
    // 设置事件监听
    setupTravelPhotosEvents();
}

// 从localStorage加载旅游照片
function loadTravelPhotosFromStorage() {
    try {
        const savedPhotos = localStorage.getItem(TRAVEL_PHOTOS_STORAGE_KEY);
        if (savedPhotos) {
            travelPhotos = JSON.parse(savedPhotos);
        }
    } catch (error) {
        console.error('加载旅游照片失败:', error);
        travelPhotos = [];
    }
}

// 保存旅游照片到localStorage
function saveTravelPhotosToStorage() {
    try {
        localStorage.setItem(TRAVEL_PHOTOS_STORAGE_KEY, JSON.stringify(travelPhotos));
    } catch (error) {
        console.error('保存旅游照片失败:', error);
        if (error.name === 'QuotaExceededError') {
            alert('存储空间不足，请删除一些照片后再试。');
        }
    }
}

// 渲染旅游照片
function renderTravelPhotos() {
    if (!travelPhotosGrid) return;
    
    // 清空现有内容
    travelPhotosGrid.innerHTML = '';
    
    if (travelPhotos.length === 0) {
        // 显示空状态
        if (travelPhotosEmpty) {
            travelPhotosGrid.appendChild(travelPhotosEmpty);
            travelPhotosEmpty.style.display = 'block';
        }
    } else {
        // 隐藏空状态
        if (travelPhotosEmpty) {
            travelPhotosEmpty.style.display = 'none';
        }
        
        // 渲染每张照片
        travelPhotos.forEach((photoData, index) => {
            const photoItem = createTravelPhotoItem(photoData, index);
            travelPhotosGrid.appendChild(photoItem);
        });
    }
}

// 创建旅游照片项
function createTravelPhotoItem(photoData, index) {
    const item = document.createElement('div');
    item.className = 'travel-photo-item';
    item.dataset.index = index;
    
    const img = document.createElement('img');
    img.src = photoData.dataUrl;
    img.alt = '旅游照片';
    img.loading = 'lazy';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.title = '删除照片';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteTravelPhoto(index);
    };
    
    item.appendChild(img);
    item.appendChild(deleteBtn);
    
    // 点击查看大图
    item.onclick = () => {
        showPhotoModal(photoData.dataUrl);
    };
    
    return item;
}

// 删除旅游照片
function deleteTravelPhoto(index) {
    if (confirm('确定要删除这张旅游照片吗？')) {
        travelPhotos.splice(index, 1);
        saveTravelPhotosToStorage();
        renderTravelPhotos();
    }
}

// 添加旅游照片
function addTravelPhoto(file) {
    return new Promise((resolve, reject) => {
        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件！');
            reject(new Error('不是图片文件'));
            return;
        }
        
        // 检查文件大小（限制为5MB）
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5MB！');
            reject(new Error('文件过大'));
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            const photoData = {
                dataUrl: dataUrl,
                name: file.name,
                size: file.size,
                type: file.type,
                timestamp: Date.now()
            };
            
            travelPhotos.push(photoData);
            saveTravelPhotosToStorage();
            renderTravelPhotos();
            resolve(photoData);
        };
        
        reader.onerror = () => {
            alert('读取文件失败，请重试！');
            reject(new Error('读取失败'));
        };
        
        reader.readAsDataURL(file);
    });
}

// 设置旅游照片事件监听
function setupTravelPhotosEvents() {
    // 文件选择
    if (travelFileInput) {
        travelFileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                addTravelPhoto(file).catch(err => console.error(err));
            });
            // 清空input
            travelFileInput.value = '';
        });
    }
    
    // 拖拽上传
    if (travelUploadArea) {
        // 阻止默认拖拽行为
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            travelUploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // 拖拽进入
        travelUploadArea.addEventListener('dragenter', () => {
            travelUploadArea.classList.add('drag-over');
        });
        
        // 拖拽离开
        travelUploadArea.addEventListener('dragleave', () => {
            travelUploadArea.classList.remove('drag-over');
        });
        
        // 拖拽放下
        travelUploadArea.addEventListener('drop', (e) => {
            travelUploadArea.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files);
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    addTravelPhoto(file).catch(err => console.error(err));
                }
            });
        });
        
        // 点击上传区域
        travelUploadArea.addEventListener('click', (e) => {
            if (e.target === travelUploadArea || travelUploadArea.contains(e.target)) {
                if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
                    travelFileInput.click();
                }
            }
        });
    }
    
    // 粘贴图片（Ctrl+V 或 Cmd+V）
    document.addEventListener('paste', (e) => {
        // 检查是否在旅游照片区域可见
        if (travelPhotosSection && travelPhotosSection.style.display !== 'none') {
            const items = e.clipboardData.items;
            
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    const file = new File([blob], `旅游照片_${Date.now()}.png`, { type: blob.type });
                    addTravelPhoto(file).catch(err => console.error(err));
                    break;
                }
            }
        }
    });
}

// ============================================
// 技能项目功能实现
// ============================================

// 技能信息配置
const skillInfo = {
    'data-analysis': {
        icon: '🐍',
        title: '数据分析与经济建模',
        description: '掌握 Python 编程基础，能够进行数据清洗、分析和可视化。熟练使用 Excel 进行数据处理和基础统计分析，具备经济建模的基本能力。'
    },
    'ai-economics': {
        icon: '🤖',
        title: 'AI 在经济中的应用',
        description: '理解人工智能技术在经济学与商业领域的应用场景，包括预测分析、智能推荐、自动化决策等，能够从经济角度评估 AI 技术的价值。'
    },
    'digital-economy': {
        icon: '🌐',
        title: '数字经济与平台经济',
        description: '熟悉数字经济的基本理论和发展趋势，了解平台经济的商业模式和运行机制，能够分析新兴经济形态的特点和影响。'
    },
    'business-analysis': {
        icon: '💼',
        title: '商业分析与逻辑思维',
        description: '具备良好的商业分析能力，能够运用逻辑思维分析复杂的经济问题，识别关键因素，提出合理的解决方案。'
    },
    'information-collection': {
        icon: '📚',
        title: '信息收集与报告撰写',
        description: '擅长信息收集、数据整理和报告撰写，能够从多个渠道获取信息，进行系统化整理，并以清晰的方式呈现分析结果。'
    },
    'learning-ability': {
        icon: '🚀',
        title: '学习能力',
        description: '对新技术、新经济模式保持敏锐的观察力和强烈的学习兴趣，能够快速适应变化，持续更新知识结构。'
    }
};

// 技能项目存储键名前缀
const SKILL_PROJECTS_STORAGE_PREFIX = 'skill_projects_';

// 获取DOM元素（延迟获取，因为模态框在页面加载时可能不存在）
let skillDetailModal, skillDetailIcon, skillDetailTitle, skillDetailDescription;
let projectNameInput, projectDescInput, skillProjectFileInput, skillProjectUploadArea;
let skillProjectsGrid, skillProjectsEmpty;

// 当前技能ID
let currentSkillId = null;

// 当前选择的文件（临时存储）
let currentProjectFiles = [];

// 初始化DOM元素
function initSkillProjectElements() {
    skillDetailModal = document.getElementById('skillDetailModal');
    skillDetailIcon = document.getElementById('skillDetailIcon');
    skillDetailTitle = document.getElementById('skillDetailTitle');
    skillDetailDescription = document.getElementById('skillDetailDescription');
    projectNameInput = document.getElementById('projectNameInput');
    projectDescInput = document.getElementById('projectDescInput');
    skillProjectFileInput = document.getElementById('skillProjectFileInput');
    skillProjectUploadArea = document.getElementById('skillProjectUploadArea');
    skillProjectsGrid = document.getElementById('skillProjectsGrid');
    skillProjectsEmpty = document.getElementById('skillProjectsEmpty');
}

// 打开技能详情
function openSkillDetail(skillId) {
    console.log('打开技能详情:', skillId);
    initSkillProjectElements();
    currentSkillId = skillId;
    const skill = skillInfo[skillId];
    
    if (!skill) {
        console.error('技能信息未找到:', skillId);
        return;
    }
    
    // 设置模态框内容
    if (skillDetailIcon) skillDetailIcon.textContent = skill.icon;
    if (skillDetailTitle) skillDetailTitle.textContent = skill.title;
    if (skillDetailDescription) skillDetailDescription.textContent = skill.description;
    
    // 显示模态框
    if (skillDetailModal) {
        skillDetailModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // 禁止背景滚动
    }
    
    // 确保文件输入框存在且可用
    const fileInput = document.getElementById('skillProjectFileInput');
    if (!fileInput) {
        console.error('文件输入框不存在！');
        alert('文件输入框未找到，请刷新页面');
        return;
    }
    
    // 确保文件输入框属性正确
    fileInput.setAttribute('accept', 'image/*,.pdf,.doc,.docx,.txt');
    fileInput.setAttribute('multiple', 'multiple');
    fileInput.style.display = 'none';
    fileInput.style.position = 'absolute';
    fileInput.style.visibility = 'hidden';
    
    // 重新设置事件监听器（确保文件上传功能正常）
    setupSkillProjectEvents();
    
    // 加载并渲染项目
    renderSkillProjects();
    
    // 清空表单
    clearSkillProjectForm();
    
    console.log('技能详情已打开，文件输入框状态:', fileInput);
}

// 关闭技能详情
function closeSkillDetail() {
    if (skillDetailModal) {
        skillDetailModal.classList.remove('active');
        document.body.style.overflow = ''; // 恢复滚动
    }
    currentSkillId = null;
    currentProjectFiles = [];
}

// 点击模态框背景关闭
document.addEventListener('DOMContentLoaded', () => {
    initSkillProjectElements();
    if (skillDetailModal) {
        skillDetailModal.addEventListener('click', (e) => {
            if (e.target === skillDetailModal) {
                closeSkillDetail();
            }
        });
    }
});

// ESC键关闭
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && skillDetailModal && skillDetailModal.classList.contains('active')) {
        closeSkillDetail();
    }
});

// 从localStorage加载技能项目
function loadSkillProjects() {
    if (!currentSkillId) return [];
    
    try {
        const key = SKILL_PROJECTS_STORAGE_PREFIX + currentSkillId;
        const savedProjects = localStorage.getItem(key);
        if (savedProjects) {
            return JSON.parse(savedProjects);
        }
    } catch (error) {
        console.error('加载技能项目失败:', error);
    }
    return [];
}

// 保存技能项目到localStorage
function saveSkillProjects(projects) {
    if (!currentSkillId) return;
    
    try {
        const key = SKILL_PROJECTS_STORAGE_PREFIX + currentSkillId;
        localStorage.setItem(key, JSON.stringify(projects));
    } catch (error) {
        console.error('保存技能项目失败:', error);
        if (error.name === 'QuotaExceededError') {
            alert('存储空间不足，请删除一些项目后再试。');
        }
    }
}

// 渲染技能项目
function renderSkillProjects() {
    if (!skillProjectsGrid) return;
    
    const projects = loadSkillProjects();
    
    // 清空现有内容
    skillProjectsGrid.innerHTML = '';
    
    if (projects.length === 0) {
        // 显示空状态
        if (skillProjectsEmpty) {
            skillProjectsGrid.appendChild(skillProjectsEmpty);
            skillProjectsEmpty.style.display = 'block';
        }
    } else {
        // 隐藏空状态
        if (skillProjectsEmpty) {
            skillProjectsEmpty.style.display = 'none';
        }
        
        // 渲染每个项目
        projects.forEach((project, index) => {
            const item = createSkillProjectItem(project, index);
            skillProjectsGrid.appendChild(item);
        });
    }
}

// 创建技能项目项
function createSkillProjectItem(project, index) {
    const item = document.createElement('div');
    item.className = 'skill-project-item';
    item.dataset.index = index;
    
    const header = document.createElement('div');
    header.className = 'skill-project-item-header';
    
    const name = document.createElement('div');
    name.className = 'skill-project-item-name';
    name.textContent = project.name;
    
    header.appendChild(name);
    
    if (project.description) {
        const desc = document.createElement('div');
        desc.className = 'skill-project-item-desc';
        desc.textContent = project.description;
        header.appendChild(desc);
    }
    
    const filesContainer = document.createElement('div');
    filesContainer.className = 'skill-project-item-files';
    
    project.files.forEach((file, fileIndex) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'skill-project-file-item';
        
        const icon = document.createElement('span');
        icon.className = 'skill-project-file-icon';
        
        // 根据文件类型显示不同图标
        if (file.type.startsWith('image/')) {
            icon.textContent = '🖼️';
        } else if (file.type === 'application/pdf') {
            icon.textContent = '📄';
        } else if (file.type.includes('word') || file.type.includes('document')) {
            icon.textContent = '📝';
        } else {
            icon.textContent = '📎';
        }
        
        const fileName = document.createElement('span');
        fileName.className = 'skill-project-file-name';
        fileName.textContent = file.name;
        
        const preview = document.createElement('span');
        preview.className = 'skill-project-file-preview';
        preview.textContent = '查看';
        preview.onclick = (e) => {
            e.stopPropagation();
            previewSkillProjectFile(file.dataUrl, file.type, file.name);
        };
        
        fileItem.appendChild(icon);
        fileItem.appendChild(fileName);
        fileItem.appendChild(preview);
        filesContainer.appendChild(fileItem);
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.title = '删除项目';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteSkillProject(index);
    };
    
    item.appendChild(header);
    item.appendChild(filesContainer);
    item.appendChild(deleteBtn);
    
    return item;
}

// 预览项目文件
function previewSkillProjectFile(dataUrl, fileType, fileName) {
    if (fileType.startsWith('image/')) {
        // 图片直接查看大图
        showPhotoModal(dataUrl);
    } else {
        // 其他文件类型，尝试在新窗口打开
        const newWindow = window.open();
        if (newWindow) {
            if (fileType === 'application/pdf') {
                // PDF文件
                newWindow.document.write(`
                    <html>
                        <head><title>${fileName}</title></head>
                        <body style="margin:0; padding:0;">
                            <embed src="${dataUrl}" type="application/pdf" width="100%" height="100%" style="position:absolute; top:0; left:0;" />
                        </body>
                    </html>
                `);
            } else {
                // 其他文件类型，显示下载提示
                newWindow.document.write(`
                    <html>
                        <head><title>${fileName}</title></head>
                        <body style="margin:20px; font-family: Arial;">
                            <h2>${fileName}</h2>
                            <p>此文件类型无法在浏览器中直接预览。</p>
                            <a href="${dataUrl}" download="${fileName}" style="display:inline-block; padding:10px 20px; background:#4A90E2; color:white; text-decoration:none; border-radius:5px;">下载文件</a>
                        </body>
                    </html>
                `);
            }
        } else {
            // 如果弹窗被阻止，提供下载链接
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = fileName;
            link.click();
        }
    }
}

// 删除技能项目
function deleteSkillProject(index) {
    if (confirm('确定要删除这个项目吗？')) {
        const projects = loadSkillProjects();
        projects.splice(index, 1);
        saveSkillProjects(projects);
        renderSkillProjects();
    }
}

// 添加技能项目
function addSkillProject() {
    initSkillProjectElements();
    const name = projectNameInput ? projectNameInput.value.trim() : '';
    
    if (!name) {
        alert('请输入项目名称！');
        return;
    }
    
    if (currentProjectFiles.length === 0) {
        alert('请至少上传一个文件！');
        return;
    }
    
    const description = projectDescInput ? projectDescInput.value.trim() : '';
    
    const project = {
        name: name,
        description: description,
        files: currentProjectFiles.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size,
            dataUrl: file.dataUrl
        })),
        timestamp: Date.now()
    };
    
    const projects = loadSkillProjects();
    projects.push(project);
    saveSkillProjects(projects);
    renderSkillProjects();
    
    // 清空表单
    clearSkillProjectForm();
}

// 清空表单
function clearSkillProjectForm() {
    initSkillProjectElements();
    if (projectNameInput) projectNameInput.value = '';
    if (projectDescInput) projectDescInput.value = '';
    currentProjectFiles = [];
    
    // 清空文件输入
    if (skillProjectFileInput) {
        skillProjectFileInput.value = '';
    }
    
    // 更新上传区域显示
    updateSkillProjectUploadArea();
}

// 处理文件选择
function handleSkillProjectFiles(files) {
    const fileArray = Array.from(files);
    const promises = fileArray.map(file => {
        return new Promise((resolve, reject) => {
            // 检查文件大小（限制为10MB）
            if (file.size > 10 * 1024 * 1024) {
                alert(`文件 "${file.name}" 大小超过10MB，已跳过。`);
                reject(new Error('文件过大'));
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const fileData = {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    dataUrl: e.target.result
                };
                resolve(fileData);
            };
            
            reader.onerror = () => {
                alert(`读取文件 "${file.name}" 失败，已跳过。`);
                reject(new Error('读取失败'));
            };
            
            reader.readAsDataURL(file);
        });
    });
    
    Promise.allSettled(promises).then(results => {
        const successful = results
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value);
        
        currentProjectFiles = currentProjectFiles.concat(successful);
        
        // 更新上传区域显示
        updateSkillProjectUploadArea();
    });
}

// 更新上传区域显示
function updateSkillProjectUploadArea() {
    initSkillProjectElements();
    if (!skillProjectUploadArea) return;
    
    const uploadContent = skillProjectUploadArea.querySelector('.skill-project-upload-content');
    if (!uploadContent) return;
    
    // 确保文件输入框存在（如果不存在，创建一个）
    let fileInput = document.getElementById('skillProjectFileInput');
    if (!fileInput) {
        // 创建文件输入框
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'skillProjectFileInput';
        fileInput.setAttribute('accept', 'image/*,.pdf,.doc,.docx,.txt');
        fileInput.setAttribute('multiple', 'multiple');
        fileInput.style.display = 'none';
        fileInput.style.position = 'absolute';
        fileInput.style.visibility = 'hidden';
        fileInput.style.width = '0';
        fileInput.style.height = '0';
        // 添加到上传区域（不是uploadContent，而是uploadArea，这样不会被innerHTML替换）
        skillProjectUploadArea.appendChild(fileInput);
        // 添加事件监听
        fileInput.addEventListener('change', handleFileInputChange);
        console.log('文件输入框已创建并添加到上传区域');
    } else {
        // 确保文件输入框在上传区域中，而不是在uploadContent中
        if (fileInput.parentNode === uploadContent) {
            // 如果文件输入框在uploadContent中，移动到uploadArea
            skillProjectUploadArea.appendChild(fileInput);
        }
    }
    
    if (currentProjectFiles.length === 0) {
        uploadContent.style.display = 'block';
        uploadContent.innerHTML = `
            <div class="skill-project-upload-icon">📎</div>
            <p>点击选择或拖拽文件</p>
            <p class="skill-project-upload-hint">支持图片、PDF、文档等（Ctrl+V粘贴图片）</p>
            <button type="button" class="btn btn-primary" id="selectFileBtn" onclick="triggerFileSelect(); return false;">
                选择文件
            </button>
        `;
    } else {
        uploadContent.innerHTML = `
            <div style="text-align: left;">
                <p style="color: var(--primary-color); font-weight: 600; margin-bottom: 1rem;">已选择 ${currentProjectFiles.length} 个文件：</p>
                <div style="max-height: 200px; overflow-y: auto;">
                    ${currentProjectFiles.map((file, index) => `
                        <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: var(--white); border-radius: 5px; margin-bottom: 0.5rem;">
                            <span>${getFileIcon(file.type)}</span>
                            <span style="flex: 1; font-size: 0.9rem; color: var(--text-color);">${file.name}</span>
                            <button type="button" class="remove-file-btn" data-index="${index}" style="background: #ff4444; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 0.8rem;">×</button>
                        </div>
                    `).join('')}
                </div>
                <button type="button" class="btn btn-primary" id="continueAddFileBtn" style="margin-top: 1rem;" onclick="triggerFileSelect(); return false;">
                    继续添加文件
                </button>
            </div>
        `;
        
        // 为删除按钮添加事件监听
        const removeBtns = uploadContent.querySelectorAll('.remove-file-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(btn.getAttribute('data-index'));
                removeSkillProjectFile(index);
            });
        });
        
        // 按钮事件已通过事件委托处理，无需单独绑定
    }
}

// 获取文件图标
function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    return '📎';
}

// 移除项目文件
function removeSkillProjectFile(index) {
    currentProjectFiles.splice(index, 1);
    updateSkillProjectUploadArea();
}

// 触发文件选择（全局函数，供HTML onclick调用）
function triggerFileSelect() {
    triggerSkillFileSelect();
}

function triggerSkillFileSelect() {
    console.log('triggerSkillFileSelect 被调用');
    
    // 直接通过ID获取，确保获取到最新的DOM元素
    let fileInput = document.getElementById('skillProjectFileInput');
    
    // 如果文件输入框不存在，创建一个
    if (!fileInput) {
        console.log('文件输入框不存在，正在创建...');
        const uploadArea = document.getElementById('skillProjectUploadArea');
        if (!uploadArea) {
            console.error('上传区域不存在');
            alert('上传区域未找到，请刷新页面');
            return false;
        }
        
        // 创建文件输入框
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'skillProjectFileInput';
        fileInput.setAttribute('accept', 'image/*,.pdf,.doc,.docx,.txt');
        fileInput.setAttribute('multiple', 'multiple');
        fileInput.style.display = 'none';
        fileInput.style.position = 'absolute';
        fileInput.style.visibility = 'hidden';
        fileInput.style.width = '0';
        fileInput.style.height = '0';
        fileInput.style.opacity = '0';
        
        // 添加到上传区域
        uploadArea.appendChild(fileInput);
        
        // 添加事件监听
        fileInput.addEventListener('change', handleFileInputChange);
        
        console.log('文件输入框已创建并添加到DOM');
    }
    
    console.log('文件输入框找到:', fileInput);
    console.log('文件输入框父元素:', fileInput.parentNode);
    
    try {
        // 确保文件输入框属性正确
        fileInput.setAttribute('accept', 'image/*,.pdf,.doc,.docx,.txt');
        fileInput.setAttribute('multiple', 'multiple');
        fileInput.style.display = 'none';
        fileInput.style.position = 'absolute';
        fileInput.style.visibility = 'hidden';
        fileInput.style.width = '0';
        fileInput.style.height = '0';
        fileInput.style.opacity = '0';
        
        // 确保文件输入框在DOM中
        if (!fileInput.parentNode) {
            console.log('文件输入框不在DOM中，重新添加');
            const uploadArea = document.getElementById('skillProjectUploadArea');
            if (uploadArea) {
                uploadArea.appendChild(fileInput);
            }
        }
        
        // 使用 setTimeout 确保在下一个事件循环中触发
        setTimeout(() => {
            try {
                // 先focus再click，确保能触发
                fileInput.focus();
                fileInput.click();
                console.log('文件输入框点击已触发');
            } catch (clickError) {
                console.error('点击文件输入框时出错:', clickError);
                // 尝试使用原生方法
                try {
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    fileInput.dispatchEvent(clickEvent);
                } catch (dispatchError) {
                    console.error('dispatchEvent 也失败:', dispatchError);
                    alert('无法打开文件选择对话框。请尝试刷新页面。');
                }
            }
        }, 10);
    } catch (error) {
        console.error('触发文件选择时出错:', error);
        alert('无法打开文件选择对话框，请刷新页面重试。错误: ' + error.message);
    }
    
    return false; // 阻止默认行为和事件冒泡
}

// 文件选择处理函数
function handleFileInputChange(e) {
    console.log('文件选择事件触发', e.target.files); // 调试用
    const files = e.target.files;
    if (files && files.length > 0) {
        console.log('选择了', files.length, '个文件'); // 调试用
        handleSkillProjectFiles(files);
    }
    // 清空input，允许重复选择同一文件
    e.target.value = '';
}

// 拖拽处理函数
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDragEnter() {
    if (skillProjectUploadArea) {
        skillProjectUploadArea.classList.add('drag-over');
    }
}

function handleDragLeave() {
    if (skillProjectUploadArea) {
        skillProjectUploadArea.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    preventDefaults(e);
    if (skillProjectUploadArea) {
        skillProjectUploadArea.classList.remove('drag-over');
    }
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
        handleSkillProjectFiles(files);
    }
}

// 粘贴处理函数
function handlePaste(e) {
    // 检查是否在技能详情模态框可见
    if (skillDetailModal && skillDetailModal.classList.contains('active')) {
        const items = e.clipboardData.items;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const file = new File([blob], `粘贴图片_${Date.now()}.png`, { type: blob.type });
                handleSkillProjectFiles([file]);
                break;
            }
        }
    }
}

// 回车键提交表单
function handleEnterKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addSkillProject();
    }
}

// 注意：不再使用全局事件委托，直接使用onclick和triggerFileSelect函数

// 设置技能项目事件监听
function setupSkillProjectEvents() {
    initSkillProjectElements();
    
    // 直接通过ID获取文件输入框，确保获取到最新的引用
    const fileInput = document.getElementById('skillProjectFileInput');
    if (!fileInput) {
        console.error('setupSkillProjectEvents: 文件输入框不存在');
        return;
    }
    
    // 文件输入框change事件
    // 移除旧的事件监听器（如果存在）
    fileInput.removeEventListener('change', handleFileInputChange);
    // 添加新的事件监听器
    fileInput.addEventListener('change', handleFileInputChange);
    
    // 确保文件输入框属性正确
    fileInput.setAttribute('accept', 'image/*,.pdf,.doc,.docx,.txt');
    fileInput.setAttribute('multiple', 'multiple');
    fileInput.style.display = 'none';
    fileInput.style.position = 'absolute';
    fileInput.style.visibility = 'hidden';
    fileInput.style.width = '0';
    fileInput.style.height = '0';
    
    // 更新全局变量引用
    skillProjectFileInput = fileInput;
    
    console.log('文件输入框事件监听器已设置:', fileInput);
    
    // 拖拽上传
    if (skillProjectUploadArea) {
        // 移除旧的事件监听器
        skillProjectUploadArea.removeEventListener('dragenter', handleDragEnter);
        skillProjectUploadArea.removeEventListener('dragover', preventDefaults);
        skillProjectUploadArea.removeEventListener('dragleave', handleDragLeave);
        skillProjectUploadArea.removeEventListener('drop', handleDrop);
        
        // 添加新的事件监听器
        skillProjectUploadArea.addEventListener('dragenter', handleDragEnter);
        skillProjectUploadArea.addEventListener('dragover', preventDefaults);
        skillProjectUploadArea.addEventListener('dragleave', handleDragLeave);
        skillProjectUploadArea.addEventListener('drop', handleDrop);
        
        // 点击上传区域
        skillProjectUploadArea.removeEventListener('click', handleUploadAreaClick);
        skillProjectUploadArea.addEventListener('click', handleUploadAreaClick);
    }
    
    // 回车键提交表单
    if (projectNameInput) {
        projectNameInput.removeEventListener('keypress', handleEnterKey);
        projectNameInput.addEventListener('keypress', handleEnterKey);
    }
}

// 点击上传区域处理
function handleUploadAreaClick(e) {
    if (e.target === skillProjectUploadArea || skillProjectUploadArea.contains(e.target)) {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && !e.target.closest('button')) {
            if (skillProjectFileInput) {
                skillProjectFileInput.click();
            }
        }
    }
}

// 全局粘贴事件（只需要设置一次）
let pasteHandlerSet = false;
if (!pasteHandlerSet) {
    document.addEventListener('paste', handlePaste);
    pasteHandlerSet = true;
}

// 页面加载时初始化技能项目功能
document.addEventListener('DOMContentLoaded', () => {
    setupSkillProjectEvents();
});

