const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
let receiptIssuedDate = null;

const translations = {
  vi: {
    subtitle: 'Phiếu xác nhận cấp thêm thẻ phòng',
    heroTitle: 'Yêu cầu cấp thêm thẻ phòng',
    heroText: 'Vui lòng nhập thông tin khách, số phòng và số lượng thẻ để tạo phiếu xác nhận.',

    guestName: 'Tên khách',
    roomNumber: 'Số phòng',
    cardCount: 'Số lượng thẻ',

    termsTitle: 'Quy định sử dụng thẻ phòng',
    agreeText: 'Tôi đã đọc, hiểu và đồng ý với quy định trên.',

    createReceipt: 'Tạo phiếu xác nhận',
    reset: 'Nhập lại',

    receiptTitle: 'PHIẾU XÁC NHẬN CẤP THÊM THẺ PHÒNG',
    guestNameLabel: 'Họ và tên khách:',
    roomNumberLabel: 'Số phòng:',
    extraCardLabel: 'Số lượng thẻ cấp thêm:',
    issuedAtLabel: 'Thời gian cấp:',

    confirmationTitle: 'XÁC NHẬN CỦA KHÁCH',
    guestSignature: 'KHÁCH XÁC NHẬN',
    staffSignature: 'NHÂN VIÊN LỄ TÂN',
    signFullName: '(Ký và ghi rõ họ tên)',

    print: 'In phiếu',
    newReceipt: 'Nhập khách mới',

    cardUnit: count => `${formatCardCount(count)} thẻ`,

    termsText: count =>
      `Tôi xác nhận đã nhận thêm ${formatCardCount(count)} thẻ phòng từ Sao Mai Phu My Resort. ` +
      `Tôi có trách nhiệm bảo quản và hoàn trả thẻ khi trả phòng. ` +
      `Nếu làm mất hoặc không hoàn trả thẻ, tôi đồng ý thanh toán phí bồi thường 200.000 VND/thẻ.`,

    placeDate: date =>
      `Phú Mỹ, ngày ${date.day} tháng ${date.month} năm ${date.year}`
  },

  en: {
    subtitle: 'Additional Room Key Card Confirmation',
    heroTitle: 'Request Additional Room Key Cards',
    heroText: 'Please enter the guest name, room number and number of cards to create a confirmation form.',

    guestName: 'Guest name',
    roomNumber: 'Room number',
    cardCount: 'Number of cards',

    termsTitle: 'Room key card regulations',
    agreeText: 'I have read, understood and agreed to the regulation above.',

    createReceipt: 'Create confirmation',
    reset: 'Reset',

    receiptTitle: 'ADDITIONAL ROOM KEY CARD CONFIRMATION',
    guestNameLabel: 'Guest name:',
    roomNumberLabel: 'Room number:',
    extraCardLabel: 'Additional cards issued:',
    issuedAtLabel: 'Issued at:',

    confirmationTitle: 'GUEST CONFIRMATION',
    guestSignature: 'GUEST SIGNATURE',
    staffSignature: 'RECEPTION STAFF',
    signFullName: '(Signature and full name)',

    print: 'Print',
    newReceipt: 'New guest',

    cardUnit: count =>
      `${formatCardCount(count)} ${count === 1 ? 'card' : 'cards'}`,

    termsText: count =>
      `I confirm that I have received ${formatCardCount(count)} additional room key ` +
      `${count === 1 ? 'card' : 'cards'} from Sao Mai Phu My Resort. ` +
      `I am responsible for keeping and returning the card(s) at check-out. ` +
      `If any card is lost or not returned, I agree to pay a compensation fee of VND 200,000 per card.`,

    placeDate: date =>
      `Phu My, ${date.month}/${date.day}/${date.year}`
  },

  zh: {
    subtitle: '加发房卡确认单',
    heroTitle: '申请加发房卡',
    heroText: '请输入客人姓名、房号和加发房卡数量以生成确认单。',

    guestName: '客人姓名',
    roomNumber: '房号',
    cardCount: '房卡数量',

    termsTitle: '房卡使用规定',
    agreeText: '本人已阅读、理解并同意上述规定。',

    createReceipt: '生成确认单',
    reset: '重新填写',

    receiptTitle: '加发房卡确认单',
    guestNameLabel: '客人姓名：',
    roomNumberLabel: '房号：',
    extraCardLabel: '加发房卡数量：',
    issuedAtLabel: '发卡时间：',

    confirmationTitle: '客人确认',
    guestSignature: '客人签名',
    staffSignature: '前台员工',
    signFullName: '（签名并写明姓名）',

    print: '打印',
    newReceipt: '新客人',

    cardUnit: count => `${formatCardCount(count)} 张`,

    termsText: count =>
      `本人确认已从 Sao Mai Phu My Resort 领取 ${formatCardCount(count)} 张额外房卡。` +
      `本人负责妥善保管并在退房时归还房卡。` +
      `如房卡遗失或未归还，本人同意按每张 200,000 越南盾支付赔偿费用。`,

    placeDate: date =>
      `富美，${date.year}年${date.month}月${date.day}日`
  },

  ko: {
    subtitle: '추가 객실 카드 발급 확인서',
    heroTitle: '추가 객실 카드 요청',
    heroText: '고객 이름, 객실 번호 및 추가 카드 수량을 입력해 주세요.',

    guestName: '고객 성명',
    roomNumber: '객실 번호',
    cardCount: '카드 수량',

    termsTitle: '객실 카드 이용 규정',
    agreeText: '위 규정을 읽고 이해했으며 이에 동의합니다.',

    createReceipt: '확인서 생성',
    reset: '다시 입력',

    receiptTitle: '추가 객실 카드 발급 확인서',
    guestNameLabel: '고객 성명:',
    roomNumberLabel: '객실 번호:',
    extraCardLabel: '추가 발급 수량:',
    issuedAtLabel: '발급 시간:',

    confirmationTitle: '고객 확인',
    guestSignature: '고객 서명',
    staffSignature: '프런트 직원',
    signFullName: '(서명 및 성명)',

    print: '인쇄',
    newReceipt: '새 고객',

    cardUnit: count => `${formatCardCount(count)}장`,

    termsText: count =>
      `본인은 Sao Mai Phu My Resort로부터 추가 객실 카드 ${formatCardCount(count)}장을 수령했음을 확인합니다. ` +
      `카드를 안전하게 보관하고 체크아웃 시 반납할 책임이 있습니다. ` +
      `카드를 분실하거나 반납하지 않을 경우 카드 1장당 200,000 VND의 배상금을 지불하는 데 동의합니다.`,

    placeDate: date =>
      `푸미, ${date.year}년 ${date.month}월 ${date.day}일`
  }
};


/* =========================
   HÀM DÙNG CHUNG
========================= */

function currentLang() {
  return $('#language')?.value || 'vi';
}

function getCardCount() {
  const input = $('#cardCount');
  const value = Number(input?.value);

  if (!Number.isFinite(value) || value < 1) {
    return 1;
  }

  return Math.min(10, Math.floor(value));
}

function formatCardCount(value) {
  return String(value).padStart(2, '0');
}

function dateParts(date) {
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    year: date.getFullYear()
  };
}

function formatDateTime(date, language) {
  const locale = {
    vi: 'vi-VN',
    en: 'en-US',
    zh: 'zh-CN',
    ko: 'ko-KR'
  }[language] || 'vi-VN';

  return date.toLocaleString(locale);
}
function formatPlaceDate(date, language) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  switch (language) {
    case 'en':
      return `Phu My, ${month}/${day}/${year}`;

    case 'zh':
      return `富美，${year}年${month}月${day}日`;

    case 'ko':
      return `푸미, ${year}년 ${month}월 ${day}일`;

    case 'vi':
    default:
      return `Phú Mỹ, ngày ${day} tháng ${month} năm ${year}`;
  }
}

/* =========================
   CẬP NHẬT SỐ LƯỢNG THẺ
========================= */

function updateCardCountText() {
  const language = currentLang();
  const count = getCardCount();
  const dictionary = translations[language];

  const termsText = $('#termsText');
  const confirmationText = $('#confirmationText');
  const receiptCardCount = $('#rCardCount');

  if (termsText) {
    termsText.textContent = dictionary.termsText(count);
  }

  if (confirmationText) {
    confirmationText.textContent = dictionary.termsText(count);
  }

  if (receiptCardCount) {
    receiptCardCount.textContent = dictionary.cardUnit(count);
  }
}


/* =========================
   ĐỔI NGÔN NGỮ
========================= */

function setLanguage(language) {
  document.documentElement.lang = language;
  localStorage.roomCardLang = language;

  $$('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    const value = translations[language]?.[key];

    if (typeof value === 'string') {
      element.textContent = value;
    }
  });

  updateCardCountText();
}


/* =========================
   KHỞI TẠO TRANG
========================= */

const languageSelect = $('#language');

if (languageSelect) {
  languageSelect.value =
    localStorage.roomCardLang || 'vi';

  setLanguage(languageSelect.value);

  languageSelect.onchange = event => {
    setLanguage(event.target.value);
  };
}

const yearElement = $('#year');

if (yearElement) {
  yearElement.textContent =
    new Date().getFullYear();
}

const cardCountInput = $('#cardCount');

if (cardCountInput) {
  cardCountInput.addEventListener(
    'input',
    updateCardCountText
  );

  cardCountInput.addEventListener(
    'change',
    updateCardCountText
  );
}

updateCardCountText();


/* =========================
   TẠO PHIẾU
========================= */

const requestForm = $('#requestForm');

if (requestForm) {
  requestForm.onsubmit = event => {
    event.preventDefault();

    const guestName =
      $('#guestName').value.trim();

    const roomNumber =
      $('#roomNumber').value.trim();

    const cardCount =
      getCardCount();

    const now =
      new Date();

    const language =
      currentLang();

    $('#rGuestName').textContent =
      guestName;

    $('#rRoomNumber').textContent =
      roomNumber;

    $('#rCardCount').textContent =
      translations[language].cardUnit(cardCount);

    $('#rIssuedAt').textContent =
      formatDateTime(now, language);

    $('#confirmationText').textContent =
      translations[language].termsText(cardCount);

    $('#rPlaceDate').textContent =
  formatPlaceDate(now, language);

    $('#receipt').classList.remove('hidden');

    $('#receipt').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };


  requestForm.addEventListener('reset', () => {
    setTimeout(() => {
      updateCardCountText();
    }, 0);
  });
}


/* =========================
   IN PHIẾU
========================= */

const printButton = $('#printBtn');

if (printButton) {
  printButton.onclick = () => {
    window.print();
  };
}


/* =========================
   NHẬP KHÁCH MỚI
========================= */

const newButton = $('#newBtn');

if (newButton) {
  newButton.onclick = () => {
    requestForm.reset();

    $('#receipt').classList.add('hidden');

    updateCardCountText();

    $('#guestName').focus();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
}
