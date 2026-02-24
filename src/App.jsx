import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Pose } from '@mediapipe/pose';
import {
  Camera,
  Download,
  Share2,
  X,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Image as ImageIcon,
  ArrowLeft,
  Shirt,
  Zap,
  Smartphone,
  ArrowRight,
  Trash2
} from 'lucide-react';

/* =======================================================================================
   CONFIG
   ======================================================================================= */

const VIDEO_WIDTH = 16;  // virtual units for video plane
const VIDEO_HEIGHT = 9;

const CLOTHING_ITEMS = [
  {
    id: 1,
    name: 'Black T-Shirt',
    description: 'Everyday fit with soft cotton feel.',
    model: '/blacktshirt.png',
    thumbnail:
      '#',
    scaleMultiplier: 1.05,
    tag: 'Casual'
  },
  {
    id: 2,
    name: 'Green T-Shirt',
    description: 'Relaxed hoodie for street-ready looks.',
    model: '/greentshirt.png',
    thumbnail:
      '#',
    scaleMultiplier: 1.08,
    tag: 'Hoodie'
  },
  {
    id: 3,
    name: 'black polo tshirt',
    description: 'Lightweight shirt for breezy days.',
    model: '/blackpolo.png',
    thumbnail:
      '#',
    scaleMultiplier: 1.05,
    tag: 'Summer'
  },
  {
    id: 4,
    name: 'Navy blue Shirt',
    description: 'Relaxed shirt for street-ready looks.',
    model: '/navyblueshirt.png',
    thumbnail:
      '#',
    scaleMultiplier: 1.08,
    tag: 'Shirt'
  },
  {
    id: 5,
    name: 'yellow T-Shirt',
    description: 'Relaxed tshirt for street-ready looks.',
    model: '/yellowtshirt.png',
    thumbnail:
      '#',
    scaleMultiplier: 1.08,
    tag: 'tshirt'
  },
];

/* =======================================================================================
   UI COMPONENTS: SIDEBAR, GALLERY, BADGES, ETC.
   ======================================================================================= */

const Sidebar = ({ items, activeItem, onSelect, isOpen, onToggle }) => {
  return (
    <div className="pointer-events-auto relative h-full z-20">
      {/* Desktop sidebar (left rail) */}
      <div
        className={`hidden md:flex flex-col bg-black/80 backdrop-blur-xl border-r border-white/10 transition-all duration-300 h-full ${
          isOpen ? 'w-72' : 'w-20'
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600/80 p-2 rounded-xl">
                <ShoppingBag className="text-white" size={20} />
              </div>
              {isOpen && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 uppercase tracking-wide">
                    Wardrobe
                  </span>
                  <span className="text-base font-semibold text-white">
                    Try New Fits
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={onToggle}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10"
            >
              {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scroll">
            {items.map((item) => {
              const isActive = activeItem.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className={`w-full flex items-center gap-3 p-2 rounded-2xl border transition-all ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-500/15 shadow-[0_0_20px_rgba(79,70,229,0.5)]'
                      : 'border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-black flex items-center justify-center text-[9px]">
                        ✓
                      </span>
                    )}
                  </div>
                  {isOpen && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-white">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {item.description}
                      </span>
                      <span className="mt-1 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/10 text-indigo-300">
                        {item.tag}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile floating wardrobe button (actual menu can be simple for now) */}
      <div className="md:hidden absolute left-3 top-3">
        <button
          onClick={onToggle}
          className="p-3 rounded-full bg-black/70 border border-white/10 shadow-lg flex items-center justify-center"
        >
          <ShoppingBag className="text-white" size={20} />
        </button>
      </div>

      {/* Basic mobile wardrobe drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-black/90 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 h-full flex flex-col w-64">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ShoppingBag className="text-indigo-400" /> Wardrobe
            </h2>
            <button
              onClick={onToggle}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {items.map((item) => {
              const isActive = activeItem.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onToggle();
                  }}
                  className={`w-full flex items-center gap-3 p-2 rounded-2xl border transition-all ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-500/15'
                      : 'border-transparent hover:bg-white/10'
                  }`}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-white">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {item.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const GalleryModal = ({ images, onClose, onDelete }) => (
  <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl p-6 animate-in fade-in">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <ImageIcon /> Gallery
      </h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-white/10 rounded-full text-white"
      >
        <X />
      </button>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto h-[75vh] pr-1 custom-scroll">
      {images.map((img) => (
        <div
          key={img.id}
          className="relative group rounded-xl overflow-hidden border border-white/10 aspect-[3/4]"
        >
          <img
            src={img.url}
            className="w-full h-full object-cover"
            alt="snapshot"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <a
              href={img.url}
              download={`tryon-${img.id}.png`}
              className="p-3 bg-white/20 rounded-full hover:bg-white/40 text-white transition"
            >
              <Download size={20} />
            </a>
            <button
              onClick={() => onDelete(img.id)}
              className="p-3 bg-red-500/80 rounded-full hover:bg-red-600 text-white transition"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
      {images.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-20">
          No photos yet. Start snapping!
        </div>
      )}
    </div>
  </div>
);

/* =======================================================================================
   TRY-ON EXPERIENCE (AR VIEW)
   ======================================================================================= */

const TryOnExperience = ({ onBack }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [activeItem, setActiveItem] = useState(CLOTHING_ITEMS[0]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [status, setStatus] = useState('Initializing camera...');

  // Store heavy objects + smoothing state in refs
  const refs = useRef({
    renderer: null,
    scene: null,
    camera: null,
    shirtGroup: null,
    pose: null,
    landmarks: null,
    frameId: null,
    videoTexture: null,
    handleResize: null,
    smoothing: {
      x: 0,
      y: 0,
      scale: 1,
      rotZ: 0,
      rotY: 0
    }
  });

  // Keep activeItem in refs to avoid stale closure in update loop
  useEffect(() => {
    refs.current.activeItem = activeItem;
  }, [activeItem]);

  // Simple linear interpolation
  const lerp = (from, to, t) => from + (to - from) * t;

  // Shirt placement + flicker smoothing
  const updateAvatar = () => {
    const { shirtGroup, landmarks, smoothing, activeItem } = refs.current;
    if (!shirtGroup || !landmarks || !activeItem) return;

    const ls = landmarks[11]; // left shoulder
    const rs = landmarks[12]; // right shoulder
    const lh = landmarks[23]; // left hip
    const rh = landmarks[24]; // right hip

    if (!ls || !rs || ls.visibility < 0.4 || rs.visibility < 0.4) {
      shirtGroup.visible = false;
      return;
    }

    // Centers
    const shoulderCx = (ls.x + rs.x) / 2;
    const shoulderCy = (ls.y + rs.y) / 2;
    const hasHips = lh && rh && lh.visibility > 0.3 && rh.visibility > 0.3;
    const hipCy = hasHips ? (lh.y + rh.y) / 2 : shoulderCy + 0.25;

    const chestY = shoulderCy + (hipCy - shoulderCy) * 0.38;

    // Convert normalized coord → scene coordinates
    const targetXScene = (0.5 - shoulderCx) * VIDEO_WIDTH;
    const targetYBase = (0.5 - chestY) * VIDEO_HEIGHT;

    // Shoulder width + torso height for scaling
    const dx = (rs.x - ls.x) * VIDEO_WIDTH;
    const dy = (rs.y - ls.y) * VIDEO_HEIGHT;
    const shoulderWidth = Math.sqrt(dx * dx + dy * dy);
    const torsoHeight =
      Math.abs((hipCy - shoulderCy) * VIDEO_HEIGHT) || shoulderWidth * 1.2;

    const targetScaleRaw =
      ((shoulderWidth * 0.6 + torsoHeight * 1.4) / 2) *
      1.35 *
      (activeItem.scaleMultiplier || 1);

    // Vertical offset so shirt is not on face
    const targetYScene = targetYBase - torsoHeight * 0.22;

    // Rotation
    const targetRotZ = Math.atan2(dy, dx);
    const targetRotY = (ls.z - rs.z) * 6;

    // Apply smoothing (lower t = smoother, higher t = more responsive)
    const t = 0.25;
    smoothing.x = lerp(smoothing.x, targetXScene, t);
    smoothing.y = lerp(smoothing.y, targetYScene, t);
    smoothing.scale = lerp(smoothing.scale, targetScaleRaw, t);
    smoothing.rotZ = lerp(smoothing.rotZ, targetRotZ, t);
    smoothing.rotY = lerp(smoothing.rotY, targetRotY, t);

    shirtGroup.position.set(smoothing.x, smoothing.y, 0);
    shirtGroup.scale.set(smoothing.scale, smoothing.scale, smoothing.scale);
    shirtGroup.rotation.set(0, -smoothing.rotY, smoothing.rotZ);
    shirtGroup.visible = true;
  };

  // Initialize camera + mediapipe + Three.js
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        // 1. Camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        if (!videoRef.current || !isMounted) return;

        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});

        // 2. Pose from Mediapipe
        const pose = new Pose({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        pose.onResults((results) => {
          if (!isMounted) return;
          if (results.poseLandmarks) {
            refs.current.landmarks = results.poseLandmarks;
          } else {
            refs.current.landmarks = null;
          }
        });

        refs.current.pose = pose;

        // 3. Three.js
        initThreeJS();
        startLoop();

        setStatus(null);
      } catch (err) {
        console.error(err);
        setStatus('Failed to initialize AR. Check camera permissions and HTTPS.');
      }
    };

    const initThreeJS = () => {
      if (!canvasRef.current) return;

      const container = canvasRef.current;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 20;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true
      });

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // Basic light
      const ambient = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambient);

      // Video background
      const videoTexture = new THREE.VideoTexture(videoRef.current);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.generateMipmaps = false;
      videoTexture.colorSpace = THREE.SRGBColorSpace;

      const videoPlane = new THREE.PlaneGeometry(VIDEO_WIDTH * 1.8, VIDEO_HEIGHT * 1.8);
      const videoMat = new THREE.MeshBasicMaterial({ map: videoTexture });
      const videoMesh = new THREE.Mesh(videoPlane, videoMat);

      videoMesh.scale.x = -1; // mirror for selfie
      videoMesh.position.z = -1;
      scene.add(videoMesh);

      // Shirt group
      const shirtGroup = new THREE.Group();
      shirtGroup.visible = false;
      scene.add(shirtGroup);

      refs.current.scene = scene;
      refs.current.camera = camera;
      refs.current.renderer = renderer;
      refs.current.shirtGroup = shirtGroup;
      refs.current.videoTexture = videoTexture;

      const handleResize = () => {
        const newW = container.clientWidth || window.innerWidth;
        const newH = container.clientHeight || window.innerHeight;
        renderer.setSize(newW, newH);
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
      };

      window.addEventListener('resize', handleResize);
      refs.current.handleResize = handleResize;
    };

    const startLoop = () => {
      const loop = async () => {
        const { pose, renderer, scene, camera, videoTexture } = refs.current;
        if (!renderer || !scene || !camera) return;

        // Send current frame to Mediapipe (async)
        if (videoRef.current && videoRef.current.readyState >= 2 && pose) {
          await pose.send({ image: videoRef.current });
        }

        // Update shirt position/scale
        updateAvatar();

        // Ensure video texture refreshes
        if (videoTexture) {
          videoTexture.needsUpdate = true;
        }

        renderer.render(scene, camera);
        refs.current.frameId = requestAnimationFrame(loop);
      };

      loop();
    };

    init();

    return () => {
      isMounted = false;

      const { frameId, pose, renderer, handleResize } = refs.current;

      if (frameId) cancelAnimationFrame(frameId);
      if (pose) pose.close();
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }

      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Load / change clothing texture
  useEffect(() => {
    const { shirtGroup } = refs.current;
    if (!shirtGroup) return;

    const loader = new THREE.TextureLoader();
    loader.load(
      activeItem.model,
      (texture) => {
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;

        shirtGroup.clear();

        const aspect =
          texture.image && texture.image.height
            ? texture.image.width / texture.image.height
            : 1;

        const height = 2;
        const width = height * aspect;

        const geo = new THREE.PlaneGeometry(width, height);
        const mat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geo, mat);
        shirtGroup.add(mesh);
      },
      undefined,
      (err) => {
        console.error('Failed to load clothing texture', err);
      }
    );
  }, [activeItem]);

  // Capture snapshot
  const takeSnapshot = () => {
    const { renderer } = refs.current;
    if (!renderer) return;

    renderer.domElement.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setGallery((prev) => [{ id: Date.now(), url, blob }, ...prev]);
    });
  };

  return (
    <div className="h-screen w-full bg-black overflow-hidden relative font-sans text-white">
      {/* Hidden video element (texture source) */}
      <video
        ref={videoRef}
        className="absolute w-1 h-1 opacity-0 pointer-events-none"
        playsInline
        muted
      />

      {/* Three.js canvas container (fullscreen) */}
      <div ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Status overlay */}
      {status && (
        <div className="absolute inset-0 z-40 bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-300 text-sm">{status}</p>
          </div>
        </div>
      )}

      {/* UI overlay */}
      <div className="absolute inset-0 z-30 flex pointer-events-none">
        {/* Sidebar */}
        <Sidebar
          items={CLOTHING_ITEMS}
          activeItem={activeItem}
          onSelect={setActiveItem}
          isOpen={isSidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Main overlay controls */}
        <div className="flex-1 flex flex-col justify-between p-4 md:p-6">
          {/* Top row: Back + Gallery */}
          <div className="flex justify-between items-center pointer-events-auto">
            <button
              onClick={onBack}
              className="p-2 md:p-3 rounded-full bg-black/50 border border-white/10 hover:bg-white/10 transition"
            >
              <ArrowLeft size={22} />
            </button>

            <button
              onClick={() => setShowGallery(true)}
              className="p-2 md:p-3 rounded-full bg-black/50 border border-white/10 hover:bg-white/10 transition relative"
            >
              <ImageIcon size={22} />
              {gallery.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 text-[10px] flex items-center justify-center">
                  {gallery.length}
                </span>
              )}
            </button>
          </div>

          {/* Bottom row: Capture button */}
          <div className="flex justify-center pointer-events-auto mb-4 md:mb-8">
            <button
              onClick={takeSnapshot}
              className="w-20 h-20 rounded-full border-4 border-white/25 p-1 hover:border-white transition hover:scale-105 active:scale-95 group bg-black/40"
            >
              <div className="w-full h-full rounded-full bg-white group-hover:bg-indigo-500 transition flex items-center justify-center shadow-xl">
                <Camera
                  className="text-black group-hover:text-white transition"
                  size={30}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Gallery modal */}
      {showGallery && (
        <GalleryModal
          images={gallery}
          onClose={() => setShowGallery(false)}
          onDelete={(id) =>
            setGallery((prev) => prev.filter((img) => img.id !== id))
          }
        />
      )}
    </div>
  );
};

/* =======================================================================================
   LANDING PAGE (HOME)
   ======================================================================================= */

const LandingPage = ({ onStart }) => {
  const features = [
    {
      icon: <Zap />,
      title: 'Real-Time AR',
      desc: 'Smooth body tracking that stays locked to your movements.'
    },
    {
      icon: <Share2 />,
      title: 'Instant Sharing',
      desc: 'Capture your look and send to your friends in seconds.'
    },
    {
      icon: <Smartphone />,
      title: 'Mobile Ready',
      desc: 'Works right in your browser, no downloads needed.'
    }
  ];

  const steps = [
    'Stand in front of your camera with good lighting.',
    'Choose your favorite shirt or hoodie from the wardrobe.',
    'Move around, turn sideways, raise your arms – see how it fits!',
    'Capture your best moment and download or share the photo.'
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-6 md:px-10 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/90 p-2.5 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.6)]">
            <Shirt size={26} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight">
              Clothroom<span className="text-indigo-400">.in</span>
            </span>
            <span className="text-xs text-gray-400 uppercase tracking-[0.18em]">
              Wear your imagination
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <span className="hover:text-white cursor-pointer transition">
            Features
          </span>
          <span className="hover:text-white cursor-pointer transition">
            How it works
          </span>
          <span className="hover:text-white cursor-pointer transition">
            Support
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-10 -left-10 md:-left-32 w-72 md:w-96 h-72 md:h-96 bg-indigo-600/25 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 -right-10 md:-right-32 w-72 md:w-96 h-72 md:h-96 bg-purple-600/25 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),transparent_55%)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex margin-2 items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 m-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Now testing: Real-time AR fitting in your browser</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Try Clothes On <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-400">
              Without Leaving Your Chair
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Clothroom.in turns your camera into a live fitting room. Rotate,
            move, pose – see how each outfit actually sits on your body in
            real-time.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={onStart}
              className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-[0_0_25px_rgba(79,70,229,0.6)]"
            >
              Start AR Try-On
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-full text-sm text-gray-200 border border-white/10 flex items-center gap-2 justify-center">
              <Camera size={18} />
              Watch demo
            </button>
          </div>
        </div>

        {/* Features grid */}
        <section className="relative z-10 mt-16 md:mt-24 mb-16 w-full max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition text-left flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-base">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Steps / How it works */}
        <section className="relative z-10 w-full max-w-4xl mx-auto px-4 mb-16">
          <div className="rounded-3xl bg-black/40 border border-white/10 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 items-start">
            <div className="flex-1 text-left">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                How Clothroom.in works
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Our AR engine uses pose estimation and 2D garment overlays to
                place each outfit realistically on your body – live and
                responsive.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                {steps.map((step, idx) => (
                  <li key={idx} className="flex gap-2 items-start">
                    <span className="mt-1 w-5 h-5 rounded-full bg-indigo-600 text-[11px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full md:w-72 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-4 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between text-xs text-gray-300">
                <span>Session Ready</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="w-24 h-24 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-3">
                  <Shirt size={42} className="text-indigo-300" />
                </div>
                <p className="text-sm text-gray-300">
                  Enable your camera on the next screen to start the experience.
                </p>
              </div>
              <button
                onClick={onStart}
                className="w-full py-2.5 rounded-full bg-white/90 text-black text-sm font-semibold hover:bg-white"
              >
                Enter Try-On Studio
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-500 text-xs border-t border-white/5">
        &copy; {new Date().getFullYear()} created by abhishek roshan. All rights
        reserved.
      </footer>
    </div>
  );
};

/* =======================================================================================
   ROOT APP
   ======================================================================================= */

export default function App() {
  const [view, setView] = useState('home');

  return view === 'home' ? (
    <LandingPage onStart={() => setView('tryon')} />
  ) : (
    <TryOnExperience onBack={() => setView('home')} />
  );
}
