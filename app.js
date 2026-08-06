const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const translations = {
  vi: {
    subtitle:'Phiếu xác nhận cấp thêm thẻ phòng',heroTitle:'Yêu cầu cấp thêm thẻ phòng',heroText:'Vui lòng nhập thông tin khách và số phòng để tạo phiếu xác nhận.',guestName:'Tên khách',roomNumber:'Số phòng',termsTitle:'Quy định sử dụng thẻ phòng',termsText:'Tôi xác nhận đã nhận thêm 01 thẻ phòng từ Sao Mai Phu My Resort. Tôi có trách nhiệm bảo quản và hoàn trả thẻ khi trả phòng. Nếu làm mất hoặc không hoàn trả thẻ, tôi đồng ý thanh toán phí bồi thường 200.000 VND/thẻ.',agreeText:'Tôi đã đọc, hiểu và đồng ý với quy định trên.',createReceipt:'Tạo phiếu xác nhận',reset:'Nhập lại',receiptTitle:'PHIẾU XÁC NHẬN CẤP THÊM THẺ PHÒNG',guestNameLabel:'Họ và tên khách:',roomNumberLabel:'Số phòng:',extraCardLabel:'Số lượng thẻ cấp thêm:',oneCard:'01 thẻ',issuedAtLabel:'Thời gian cấp:',confirmationTitle:'XÁC NHẬN CỦA KHÁCH',confirmationText:'Tôi xác nhận đã nhận thêm 01 thẻ phòng từ Sao Mai Phu My Resort. Tôi có trách nhiệm bảo quản và hoàn trả thẻ khi trả phòng. Nếu làm mất hoặc không hoàn trả thẻ, tôi đồng ý thanh toán phí bồi thường 200.000 VND/thẻ.',guestSignature:'KHÁCH XÁC NHẬN',staffSignature:'NHÂN VIÊN LỄ TÂN',signFullName:'(Ký và ghi rõ họ tên)',print:'In phiếu',newReceipt:'Nhập khách mới',placeDate:(d)=>`Phú Mỹ, ngày ${d.day} tháng ${d.month} năm ${d.year}`
  },
  en: {
    subtitle:'Additional Room Key Card Confirmation',heroTitle:'Request an Additional Room Key Card',heroText:'Please enter the guest name and room number to create a confirmation form.',guestName:'Guest name',roomNumber:'Room number',termsTitle:'Room key card regulations',termsText:'I confirm that I have received one additional room key card from Sao Mai Phu My Resort. I am responsible for keeping and returning the card at check-out. If the card is lost or not returned, I agree to pay a compensation fee of VND 200,000 per card.',agreeText:'I have read, understood and agreed to the regulation above.',createReceipt:'Create confirmation',reset:'Reset',receiptTitle:'ADDITIONAL ROOM KEY CARD CONFIRMATION',guestNameLabel:'Guest name:',roomNumberLabel:'Room number:',extraCardLabel:'Additional cards issued:',oneCard:'01 card',issuedAtLabel:'Issued at:',confirmationTitle:'GUEST CONFIRMATION',confirmationText:'I confirm that I have received one additional room key card from Sao Mai Phu My Resort. I am responsible for keeping and returning the card at check-out. If the card is lost or not returned, I agree to pay a compensation fee of VND 200,000 per card.',guestSignature:'GUEST SIGNATURE',staffSignature:'RECEPTION STAFF',signFullName:'(Signature and full name)',print:'Print',newReceipt:'New guest',placeDate:(d)=>`Phu My, ${d.month}/${d.day}/${d.year}`
  },
  zh: {
    subtitle:'加发房卡确认单',heroTitle:'申请加发房卡',heroText:'请输入客人姓名和房号以生成确认单。',guestName:'客人姓名',roomNumber:'房号',termsTitle:'房卡使用规定',termsText:'本人确认已从 Sao Mai Phu My Resort 领取一张额外房卡，并负责妥善保管及在退房时归还。如房卡遗失或未归还，本人同意按每张 200,000 越南盾支付赔偿费用。',agreeText:'本人已阅读、理解并同意上述规定。',createReceipt:'生成确认单',reset:'重新填写',receiptTitle:'加发房卡确认单',guestNameLabel:'客人姓名：',roomNumberLabel:'房号：',extraCardLabel:'加发房卡数量：',oneCard:'01 张',issuedAtLabel:'发卡时间：',confirmationTitle:'客人确认',confirmationText:'本人确认已从 Sao Mai Phu My Resort 领取一张额外房卡，并负责妥善保管及在退房时归还。如房卡遗失或未归还，本人同意按每张 200,000 越南盾支付赔偿费用。',guestSignature:'客人签名',staffSignature:'前台员工',signFullName:'（签名并写明姓名）',print:'打印',newReceipt:'新客人',placeDate:(d)=>`富美，${d.year}年${d.month}月${d.day}日`
  },
  ko: {
    subtitle:'추가 객실 카드 발급 확인서',heroTitle:'추가 객실 카드 요청',heroText:'확인서를 만들려면 고객 이름과 객실 번호를 입력해 주세요.',guestName:'고객 성명',roomNumber:'객실 번호',termsTitle:'객실 카드 이용 규정',termsText:'본인은 Sao Mai Phu My Resort로부터 추가 객실 카드 1장을 수령했음을 확인합니다. 카드를 안전하게 보관하고 체크아웃 시 반납할 책임이 있습니다. 카드를 분실하거나 반납하지 않을 경우 카드 1장당 200,000 VND의 배상금을 지불하는 데 동의합니다.',agreeText:'위 규정을 읽고 이해했으며 이에 동의합니다.',createReceipt:'확인서 생성',reset:'다시 입력',receiptTitle:'추가 객실 카드 발급 확인서',guestNameLabel:'고객 성명:',roomNumberLabel:'객실 번호:',extraCardLabel:'추가 발급 수량:',oneCard:'01장',issuedAtLabel:'발급 시간:',confirmationTitle:'고객 확인',confirmationText:'본인은 Sao Mai Phu My Resort로부터 추가 객실 카드 1장을 수령했음을 확인합니다. 카드를 안전하게 보관하고 체크아웃 시 반납할 책임이 있습니다. 카드를 분실하거나 반납하지 않을 경우 카드 1장당 200,000 VND의 배상금을 지불하는 데 동의합니다.',guestSignature:'고객 서명',staffSignature:'프런트 직원',signFullName:'(서명 및 성명)',print:'인쇄',newReceipt:'새 고객',placeDate:(d)=>`푸미, ${d.year}년 ${d.month}월 ${d.day}일`
  }
};

function currentLang(){ return $('#language').value || 'vi'; }
function setLanguage(lang){
  document.documentElement.lang = lang;
  localStorage.roomCardLang = lang;
  $$('[data-i18n]').forEach(el=>{
    const key = el.dataset.i18n;
    const value = translations[lang]?.[key];
    if(typeof value === 'string') el.textContent = value;
  });
}
function dateParts(date){ return {day:String(date.getDate()).padStart(2,'0'),month:String(date.getMonth()+1).padStart(2,'0'),year:date.getFullYear()}; }
function formatDateTime(date,lang){
  const locale = {vi:'vi-VN',en:'en-US',zh:'zh-CN',ko:'ko-KR'}[lang] || 'vi-VN';
  return date.toLocaleString(locale);
}

$('#language').value = localStorage.roomCardLang || 'vi';
setLanguage($('#language').value);
$('#language').onchange = e => setLanguage(e.target.value);
$('#year').textContent = new Date().getFullYear();

$('#requestForm').onsubmit = e => {
  e.preventDefault();
  const guestName = $('#guestName').value.trim();
  const roomNumber = $('#roomNumber').value.trim();
  const now = new Date();
  const lang = currentLang();

  $('#rGuestName').textContent = guestName;
  $('#rRoomNumber').textContent = roomNumber;
  $('#rIssuedAt').textContent = formatDateTime(now,lang);
  $('#rPlaceDate').textContent = translations[lang].placeDate(dateParts(now));
  $('#receipt').classList.remove('hidden');
  $('#receipt').scrollIntoView({behavior:'smooth',block:'start'});
};

$('#printBtn').onclick = () => window.print();
$('#newBtn').onclick = () => {
  $('#requestForm').reset();
  $('#receipt').classList.add('hidden');
  $('#guestName').focus();
  window.scrollTo({top:0,behavior:'smooth'});
};
