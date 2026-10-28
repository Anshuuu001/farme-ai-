import { useState, useRef } from 'react';
import {
  UploadCloudIcon,
  TrashIcon,
  RefreshCwIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  LeafIcon,
  SparklesIcon,
  UserIcon
} from '../components/common/Icons';
import { api } from '../services/api';

export default function ScanPage({ currentUser, onScanSuccess, onNavigate }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  function handleFile(file) {
    setValidationError('');
    setApiError('');

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setValidationError('Unsupported file format. Please upload a JPEG, PNG, or WEBP image.');
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setValidationError(`Image size (${fileSizeMB.toFixed(1)}MB) exceeds the 10MB limit.`);
      return;
    }

    setSelectedFile(file);
    setFileMeta({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type.replace('image/', '').toUpperCase()
    });

    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleReset() {
    if (imagePreviewUrl && !imagePreviewUrl.startsWith('/images/')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setFileMeta(null);
    setValidationError('');
    setApiError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleLoadSample(type) {
    const filename = type === 'early_blight' ? 'tomato_early_blight.jpg' : 'tomato_healthy.jpg';
    const filePath = `/images/${filename}`;

    try {
      const response = await fetch(filePath);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: 'image/jpeg' });
      handleFile(file);
    } catch {
      setValidationError('Unable to load sample botanical image.');
    }
  }

  async function handleDetect() {
    setValidationError('');
    setApiError('');

    if (!currentUser?.isLoggedIn) {
      setApiError('Authentication required. Please sign in or register to run the neural network diagnostic pipeline.');
      return;
    }

    if (!selectedFile) {
      setValidationError('Please select or upload a tomato leaf image first.');
      return;
    }

    setIsScanning(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile, fileMeta?.name || 'leaf.jpg');

      const data = await api.detectDisease(formData);

      if (!data.success || !data.result) {
        throw new Error(data.error || 'Diagnostic inference failed to return results.');
      }

      onScanSuccess({
        scanId: data.scanId,
        userImage: imagePreviewUrl,
        ...data.result
      });
      onNavigate('result');
    } catch (err) {
      console.error('[Scan Error]:', err);
      setApiError(err.message || 'Inference engine failed. Ensure backend service is running.');
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <div className="scan-content">
      <div style={{ marginBottom: '24px' }}>
        <h1 className="section-title">Tomato Leaf Pathology Scan</h1>
        <p className="section-desc">
          Upload a high-resolution close-up of a single tomato leaflet for real-time neural network disease diagnosis.
        </p>
      </div>

      <div className="scan-layout-grid">
        {/* Main Uploader Area */}
        <div className="uploader-card">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {validationError && (
            <div
              style={{
                backgroundColor: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                color: 'var(--danger-text)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.875rem'
              }}
            >
              <AlertTriangleIcon size={18} />
              <span>{validationError}</span>
            </div>
          )}

          {apiError && (
            <div
              style={{
                backgroundColor: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                color: 'var(--danger-text)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                fontSize: '0.875rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangleIcon size={18} style={{ flexShrink: 0 }} />
                <span>{apiError}</span>
              </div>
              {!currentUser?.isLoggedIn && (
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => onNavigate('auth')}
                >
                  <UserIcon size={14} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          )}

          {!imagePreviewUrl ? (
            <div
              className={`dropzone-box ${isDragOver ? 'is-dragover' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') fileInputRef.current?.click();
              }}
            >
              <div className="dropzone-icon">
                <UploadCloudIcon size={30} />
              </div>
              <h3 className="dropzone-title">Click to upload or drag & drop</h3>
              <p className="dropzone-subtitle">
                Select a sharp photograph of an affected or suspect tomato leaf
              </p>
              <span className="dropzone-specs">
                Accepted: JPG, PNG, WEBP &bull; Maximum size: 10 MB
              </span>
            </div>
          ) : (
            <div className="preview-container">
              <div className="preview-media-box">
                <img
                  src={imagePreviewUrl}
                  alt="Selected tomato leaf preview"
                  className="preview-img"
                />
              </div>

              <div className="preview-actions-bar">
                <div className="image-file-meta">
                  <span>{fileMeta?.name}</span> &bull; <span>{fileMeta?.size}</span> &bull; <span>{fileMeta?.type}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={isScanning}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <RefreshCwIcon size={14} />
                    <span>Retake / Change</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger-outline btn-sm"
                    disabled={isScanning}
                    onClick={handleReset}
                  >
                    <TrashIcon size={14} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Inference Action Card */}
          <div className="card" style={{ marginTop: '24px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
                  <SparklesIcon size={18} style={{ color: 'var(--leaf-500)' }} />
                  <span>MobileNetV2 Neural Network Inference</span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Executes local ONNX inference on CPU and saves diagnosis to your authenticated scan history.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                disabled={!imagePreviewUrl || isScanning}
                onClick={handleDetect}
              >
                {isScanning ? (
                  <>
                    <RefreshCwIcon size={18} className="spin-animation" />
                    <span>Analyzing Leaf Pathology...</span>
                  </>
                ) : (
                  <>
                    <span>Detect Disease Pathology</span>
                    <ArrowRightIcon size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Guidance & Sample Leaves Panel */}
        <div className="scan-instructions-panel">
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Field Capture Standards</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)' }}>
              Follow these rules for accurate disease manifestation detection
            </p>

            <ul className="instruction-checklist">
              <li className="instruction-item">
                <CheckCircleIcon size={18} />
                <span>Focus directly on the leaf margin and concentric lesions</span>
              </li>
              <li className="instruction-item">
                <CheckCircleIcon size={18} />
                <span>Avoid extreme solar glare, shadows, or blurry camera shake</span>
              </li>
              <li className="instruction-item">
                <CheckCircleIcon size={18} />
                <span>Isolate the target leaflet from background weeds and soil</span>
              </li>
              <li className="instruction-item">
                <CheckCircleIcon size={18} />
                <span>Check lower leaves first, as early blight starts near the base</span>
              </li>
            </ul>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>
              Botanical Sample References
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)' }}>
              Test real ONNX inference without your own camera photos
            </p>

            <div className="sample-leaf-buttons">
              <button
                type="button"
                className="sample-leaf-btn"
                disabled={isScanning}
                onClick={() => handleLoadSample('early_blight')}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    Tomato Early Blight Specimen
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    Concentric ring spots &bull; Alternaria solani
                  </div>
                </div>
                <LeafIcon size={18} style={{ color: 'var(--danger-accent)' }} />
              </button>

              <button
                type="button"
                className="sample-leaf-btn"
                disabled={isScanning}
                onClick={() => handleLoadSample('healthy')}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    Healthy Tomato Leaf Specimen
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    Chlorophyll-rich &bull; Clean margin tissue
                  </div>
                </div>
                <LeafIcon size={18} style={{ color: 'var(--leaf-500)' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
