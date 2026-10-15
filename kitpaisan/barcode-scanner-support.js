(function () {
  const state = { stream: null, timer: 0, detector: null };

  function findProduct(code) {
    const value = String(code || '').trim().toLowerCase();
    return (window.products || products || []).find((product) => [product.sku, product.barcode, product.code]
      .some((key) => String(key || '').trim().toLowerCase() === value && value));
  }

  function setMessage(text, type) {
    const message = document.getElementById('barcodeScanMessage');
    if (!message) return;
    message.textContent = text || '';
    message.className = `barcode-scan-message ${type || ''}`;
  }

  function focusScanner() {
    const input = document.getElementById('barcodeInput');
    if (!input || document.body.classList.contains('pos-authenticated') === false) return;
    window.setTimeout(() => input.focus(), 30);
  }

  function addScannedProduct(code) {
    const product = findProduct(code);
    if (!product) {
      setMessage(`ไม่พบสินค้า/SKU: ${String(code || '').trim()}`, 'error');
      return false;
    }
    if (product.hidden) {
      setMessage('สินค้านี้ถูกซ่อนไว้ ยังไม่นำขึ้นขาย', 'error');
      return false;
    }
    const item = cart.find((row) => row.id === product.id);
    if (item) item.qty += 1;
    else cart.push({ id: product.id, qty: 1 });
    renderCart();
    setMessage(`เพิ่มแล้ว: ${product.name}`, 'success');
    return true;
  }

  function scanInput() {
    const input = document.getElementById('barcodeInput');
    if (!input) return;
    const code = input.value;
    input.value = '';
    if (code.trim()) addScannedProduct(code);
    focusScanner();
  }

  function stopCamera() {
    if (state.timer) cancelAnimationFrame(state.timer);
    state.timer = 0;
    if (state.stream) state.stream.getTracks().forEach((track) => track.stop());
    state.stream = null;
    const video = document.getElementById('barcodeCameraVideo');
    if (video) video.srcObject = null;
    document.getElementById('barcodeCameraPanel')?.classList.remove('open');
  }

  async function readCamera(video) {
    if (!state.detector || !state.stream) return;
    try {
      const codes = await state.detector.detect(video);
      if (codes.length && codes[0].rawValue) {
        addScannedProduct(codes[0].rawValue);
        stopCamera();
        focusScanner();
        return;
      }
    } catch (_) { /* keep scanning while the camera is active */ }
    state.timer = requestAnimationFrame(() => readCamera(video));
  }

  async function startCamera() {
    const panel = document.getElementById('barcodeCameraPanel');
    const video = document.getElementById('barcodeCameraVideo');
    if (!panel || !video) return;
    if (!('BarcodeDetector' in window) || !navigator.mediaDevices?.getUserMedia) {
      setMessage('เบราว์เซอร์นี้ยังไม่รองรับการสแกนด้วยกล้อง ใช้เครื่องสแกน USB ได้ทันที', 'error');
      return;
    }
    try {
      state.detector = new BarcodeDetector();
      state.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      video.srcObject = state.stream;
      await video.play();
      panel.classList.add('open');
      setMessage('หันกล้องไปที่บาร์โค้ด', 'info');
      readCamera(video);
    } catch (_) {
      stopCamera();
      setMessage('เปิดกล้องไม่สำเร็จ กรุณาอนุญาตการใช้กล้องหรือใช้เครื่องสแกน USB', 'error');
    }
  }

  function mount() {
    const tools = document.querySelector('.catalog-tools');
    if (!tools || document.getElementById('barcodeScannerPanel')) return;
    const panel = document.createElement('div');
    panel.id = 'barcodeScannerPanel';
    panel.className = 'barcode-scanner-panel';
    panel.innerHTML = `
      <div class="barcode-scanner-heading">
        <div><strong>สแกนบาร์โค้ด</strong><small>ยิงบาร์โค้ดแล้วกด Enter สินค้าจะเข้าตะกร้าอัตโนมัติ</small></div>
        <button type="button" class="outline-button barcode-camera-button" id="barcodeCameraButton">เปิดกล้อง</button>
      </div>
      <div class="barcode-scanner-row">
        <input id="barcodeInput" class="barcode-input" inputmode="numeric" autocomplete="off" placeholder="สแกนหรือพิมพ์ SKU แล้วกด Enter" />
        <button type="button" class="primary-button barcode-add-button" id="barcodeAddButton">เพิ่มสินค้า</button>
      </div>
      <div id="barcodeScanMessage" class="barcode-scan-message" aria-live="polite">พร้อมสแกน</div>
      <div id="barcodeCameraPanel" class="barcode-camera-panel">
        <video id="barcodeCameraVideo" playsinline muted></video>
        <button type="button" class="outline-button" id="barcodeCameraClose">ปิดกล้อง</button>
      </div>`;
    tools.prepend(panel);
    document.getElementById('barcodeInput').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); scanInput(); }
    });
    document.getElementById('barcodeAddButton').addEventListener('click', scanInput);
    document.getElementById('barcodeCameraButton').addEventListener('click', startCamera);
    document.getElementById('barcodeCameraClose').addEventListener('click', stopCamera);
    document.addEventListener('click', (event) => {
      if (event.target.closest('.barcode-scanner-panel') || event.target.closest('input,textarea,select,button')) return;
      focusScanner();
    });
    focusScanner();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
  window.addEventListener('beforeunload', stopCamera);
  window.barcodeScanner = { scan: addScannedProduct, stopCamera };
})();
