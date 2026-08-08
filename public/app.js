// ROOM CARD MANAGER - HISTORY V5 - 2026-08-08
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);const API='/api/cards';let receiptIssuedDate=null,adminItems=[];const historyOpen=new Set();const historyCache={};const D={vi:{subtitle:'Hệ thống cấp và quản lý thẻ phòng',createTab:'Tạo phiếu',manageTab:'Quản lý thẻ',rulesTab:'Quy định',heroTitle:'Yêu cầu cấp thêm thẻ phòng',heroText:'Nhập thông tin khách, số phòng và số lượng thẻ để tạo phiếu xác nhận.',guestName:'Tên khách',roomNumber:'Số phòng',cardCount:'Số lượng thẻ',termsTitle:'Quy định sử dụng thẻ phòng',agreeText:'Tôi đã đọc, hiểu và đồng ý với quy định trên.',createReceipt:'Tạo phiếu xác nhận',reset:'Nhập lại',receiptTitle:'PHIẾU XÁC NHẬN CẤP THÊM THẺ PHÒNG',codeLabel:'Mã phiếu:',guestNameLabel:'Họ và tên khách:',roomNumberLabel:'Số phòng:',extraCardLabel:'Số lượng thẻ cấp thêm:',issuedAtLabel:'Thời gian cấp:',confirmationTitle:'XÁC NHẬN CỦA KHÁCH',guestSignature:'KHÁCH XÁC NHẬN',staffSignature:'NHÂN VIÊN LỄ TÂN',signFullName:'(Ký và ghi rõ họ tên)',print:'In phiếu',newReceipt:'Nhập khách mới',manageTitle:'Quản lý thẻ phòng',manageHint:'Theo dõi phiếu cấp thẻ, hoàn trả, báo mất và tự xóa phiếu khi cần.',openList:'Mở danh sách',active:'Đang sử dụng',returned:'Đã hoàn trả',lost:'Báo mất',paid:'Đã thu phí',cancelled:'Đã hủy',compensation:'Phí bồi thường',allStatuses:'Tất cả trạng thái',code:'Mã',guest:'Khách',room:'Phòng',cards:'Số thẻ',issuedAt:'Ngày cấp',status:'Trạng thái',actions:'Thao tác',refresh:'Làm mới',selectAll:'Chọn tất cả',deleteSelected:'Xóa đã chọn',rulesTitle:'Quy định cấp thêm thẻ phòng',rule1:'Khách có trách nhiệm bảo quản và hoàn trả đầy đủ thẻ khi trả phòng.',rule2:'Nếu làm mất hoặc không hoàn trả thẻ, phí bồi thường là 200.000 VND/thẻ.',rule3:'Resort có quyền khóa thẻ để bảo đảm an ninh.',rule4:'Việc cấp thêm thẻ chỉ thực hiện sau khi xác minh thông tin khách lưu trú.',deleteOne:'Xóa',returnedAction:'Đã trả',lostAction:'Báo mất',paidAction:'Thu phí',cancelAction:'Hủy phiếu'},en:{subtitle:'Room key card issue and management',createTab:'Create receipt',manageTab:'Card management',rulesTab:'Rules',heroTitle:'Request Additional Room Key Cards',heroText:'Enter guest name, room number and number of cards.',guestName:'Guest name',roomNumber:'Room number',cardCount:'Number of cards',termsTitle:'Room key card regulations',agreeText:'I have read and agreed to the regulation above.',createReceipt:'Create confirmation',reset:'Reset',receiptTitle:'ADDITIONAL ROOM KEY CARD CONFIRMATION',codeLabel:'Receipt code:',guestNameLabel:'Guest name:',roomNumberLabel:'Room number:',extraCardLabel:'Additional cards issued:',issuedAtLabel:'Issued at:',confirmationTitle:'GUEST CONFIRMATION',guestSignature:'GUEST SIGNATURE',staffSignature:'RECEPTION STAFF',signFullName:'(Signature and full name)',print:'Print',newReceipt:'New guest',manageTitle:'Room key card management',manageHint:'Track issue receipts, returns, losses and deletion.',openList:'Open list',active:'In use',returned:'Returned',lost:'Lost',paid:'Fee paid',cancelled:'Cancelled',compensation:'Compensation',allStatuses:'All statuses',code:'Code',guest:'Guest',room:'Room',cards:'Cards',issuedAt:'Issued',status:'Status',actions:'Actions',refresh:'Refresh',selectAll:'Select all',deleteSelected:'Delete selected',rulesTitle:'Additional room key card rules',rule1:'Guests must keep and return all cards at check-out.',rule2:'Lost or unreturned cards are charged at VND 200,000 per card.',rule3:'The resort may disable cards for security purposes.',rule4:'Additional cards are issued only after guest verification.',deleteOne:'Delete',returnedAction:'Returned',lostAction:'Lost',paidAction:'Collect fee',cancelAction:'Cancel'},zh:{subtitle:'房卡发放与管理系统',createTab:'创建确认单',manageTab:'房卡管理',rulesTab:'规定',heroTitle:'申请加发房卡',heroText:'请输入客人姓名、房号和房卡数量。',guestName:'客人姓名',roomNumber:'房号',cardCount:'房卡数量',termsTitle:'房卡使用规定',agreeText:'本人已阅读、理解并同意上述规定。',createReceipt:'生成确认单',reset:'重新填写',receiptTitle:'加发房卡确认单',codeLabel:'确认单编号：',guestNameLabel:'客人姓名：',roomNumberLabel:'房号：',extraCardLabel:'加发房卡数量：',issuedAtLabel:'发卡时间：',confirmationTitle:'客人确认',guestSignature:'客人签名',staffSignature:'前台员工',signFullName:'（签名并写明姓名）',print:'打印',newReceipt:'新客人',manageTitle:'房卡管理',manageHint:'管理发卡确认单、归还、遗失及删除。',openList:'打开列表',active:'使用中',returned:'已归还',lost:'遗失',paid:'已收费',cancelled:'已取消',compensation:'赔偿费用',allStatuses:'全部状态',code:'编号',guest:'客人',room:'房号',cards:'房卡',issuedAt:'发卡时间',status:'状态',actions:'操作',refresh:'刷新',selectAll:'全选',deleteSelected:'删除所选',rulesTitle:'加发房卡规定',rule1:'客人须妥善保管并在退房时归还全部房卡。',rule2:'房卡遗失或未归还，每张赔偿200,000越南盾。',rule3:'为确保安全，度假村有权停用房卡。',rule4:'加发房卡前须核实住客信息。',deleteOne:'删除',returnedAction:'已归还',lostAction:'遗失',paidAction:'收费',cancelAction:'取消'},ko:{subtitle:'객실 카드 발급 및 관리 시스템',createTab:'확인서 생성',manageTab:'카드 관리',rulesTab:'규정',heroTitle:'추가 객실 카드 요청',heroText:'고객 이름, 객실 번호 및 카드 수량을 입력해 주세요.',guestName:'고객 성명',roomNumber:'객실 번호',cardCount:'카드 수량',termsTitle:'객실 카드 이용 규정',agreeText:'위 규정을 읽고 이해했으며 이에 동의합니다.',createReceipt:'확인서 생성',reset:'다시 입력',receiptTitle:'추가 객실 카드 발급 확인서',codeLabel:'확인서 번호:',guestNameLabel:'고객 성명:',roomNumberLabel:'객실 번호:',extraCardLabel:'추가 발급 수량:',issuedAtLabel:'발급 시간:',confirmationTitle:'고객 확인',guestSignature:'고객 서명',staffSignature:'프런트 직원',signFullName:'(서명 및 성명)',print:'인쇄',newReceipt:'새 고객',manageTitle:'객실 카드 관리',manageHint:'카드 발급 확인서, 반납, 분실 및 삭제를 관리합니다.',openList:'목록 열기',active:'사용 중',returned:'반납 완료',lost:'분실',paid:'요금 납부',cancelled:'취소',compensation:'배상금',allStatuses:'모든 상태',code:'번호',guest:'고객',room:'객실',cards:'카드',issuedAt:'발급 시간',status:'상태',actions:'작업',refresh:'새로고침',selectAll:'전체 선택',deleteSelected:'선택 삭제',rulesTitle:'추가 객실 카드 규정',rule1:'고객은 체크아웃 시 모든 카드를 반납해야 합니다.',rule2:'분실 또는 미반납 시 카드 1장당 200,000 VND가 부과됩니다.',rule3:'보안을 위해 리조트는 카드를 비활성화할 수 있습니다.',rule4:'고객 확인 후 추가 카드가 발급됩니다.',deleteOne:'삭제',returnedAction:'반납',lostAction:'분실',paidAction:'요금 수납',cancelAction:'취소'}};function L(){return $('#language')?.value||'vi'}function C(){const n=Number($('#cardCount')?.value);return Number.isFinite(n)&&n>0?Math.min(10,Math.floor(n)):1}function T(n){return String(n).padStart(2,'0')}function U(n,l=L()){if(l==='en')return `${T(n)} ${n===1?'card':'cards'}`;if(l==='zh')return `${T(n)} 张`;if(l==='ko')return `${T(n)}장`;return `${T(n)} thẻ`}function TERMS(n,l=L()){if(l==='en')return `I confirm that I have received ${U(n,l)} from Sao Mai Phu My Resort. I am responsible for keeping and returning the card(s) at check-out. If any card is lost or not returned, I agree to pay VND 200,000 per card.`;if(l==='zh')return `本人确认已从 Sao Mai Phu My Resort 领取 ${U(n,l)}额外房卡。本人负责妥善保管并在退房时归还房卡。如房卡遗失或未归还，本人同意按每张 200,000 越南盾支付赔偿费用。`;if(l==='ko')return `본인은 Sao Mai Phu My Resort로부터 추가 객실 카드 ${U(n,l)}을 수령했음을 확인합니다. 카드를 안전하게 보관하고 체크아웃 시 반납할 책임이 있습니다. 분실하거나 반납하지 않을 경우 카드 1장당 200,000 VND를 지불하는 데 동의합니다.`;return `Tôi xác nhận đã nhận thêm ${U(n,l)} phòng từ Sao Mai Phu My Resort. Tôi có trách nhiệm bảo quản và hoàn trả thẻ khi trả phòng. Nếu làm mất hoặc không hoàn trả thẻ, tôi đồng ý thanh toán phí bồi thường 200.000 VND/thẻ.`}function DT(d,l=L()){return new Date(d).toLocaleString({vi:'vi-VN',en:'en-US',zh:'zh-CN',ko:'ko-KR'}[l]||'vi-VN')}function PD(d,l=L()){d=new Date(d);const a=String(d.getDate()).padStart(2,'0'),m=String(d.getMonth()+1).padStart(2,'0'),y=d.getFullYear();if(l==='en')return `Phu My, ${m}/${a}/${y}`;if(l==='zh')return `富美，${y}年${m}月${a}日`;if(l==='ko')return `푸미, ${y}년 ${m}월 ${a}일`;return `Phú Mỹ, ngày ${a} tháng ${m} năm ${y}`}function M(n){return new Intl.NumberFormat('vi-VN').format(Number(n)||0)+' ₫'}function E(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}async function APIX(u,o={}){const r=await fetch(u,o),d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Có lỗi xảy ra');return d}function UC(){const n=C(),l=L();$('#termsText').textContent=TERMS(n,l);if($('#confirmationText'))$('#confirmationText').textContent=TERMS(n,l);if($('#rCardCount'))$('#rCardCount').textContent=U(n,l)}function SL(l){document.documentElement.lang=l;localStorage.roomCardLang=l;$$('[data-i18n]').forEach(e=>{const v=D[l]?.[e.dataset.i18n];if(v)e.textContent=v});UC();if(receiptIssuedDate){$('#rIssuedAt').textContent=DT(receiptIssuedDate,l);$('#rPlaceDate').textContent=PD(receiptIssuedDate,l)}RA()}$('#language').value=localStorage.roomCardLang||'vi';SL($('#language').value);$('#language').onchange=e=>SL(e.target.value);$('#year').textContent=new Date().getFullYear();$('#cardCount').addEventListener('input',UC);$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab,.panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#'+b.dataset.tab).classList.add('active')});$('#requestForm').onsubmit=async e=>{e.preventDefault();const b=e.submitter,o=b.textContent;b.disabled=true;b.textContent='...';try{const x=await APIX(API,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({guest_name:$('#guestName').value.trim(),room_number:$('#roomNumber').value.trim(),card_count:C()})});receiptIssuedDate=x.issued_at;$('#rCode').textContent=x.code;$('#rGuestName').textContent=x.guest_name;$('#rRoomNumber').textContent=x.room_number;$('#rCardCount').textContent=U(x.card_count);$('#rIssuedAt').textContent=DT(x.issued_at);$('#confirmationText').textContent=TERMS(x.card_count);$('#rPlaceDate').textContent=PD(x.issued_at);$('#receipt').classList.remove('hidden');$('#receipt').scrollIntoView({behavior:'smooth'})}catch(e){alert(e.message)}finally{b.disabled=false;b.textContent=o}};$('#requestForm').addEventListener('reset',()=>setTimeout(UC,0));$('#printBtn').onclick=()=>print();$('#newBtn').onclick=()=>{$('#requestForm').reset();receiptIssuedDate=null;$('#receipt').classList.add('hidden');$('#guestName').focus();scrollTo({top:0,behavior:'smooth'})};async function LA(){try{adminItems=await APIX(API,{headers:{'x-admin-pin':$('#adminPin').value}});$('#adminArea').classList.remove('hidden');RA()}catch(e){alert(e.message)}}$('#loadAdmin').onclick=LA;$('#refreshAdmin').onclick=LA;$('#adminSearch').oninput=RA;$('#statusFilter').onchange=RA;
function REM(x){
  return Math.max(
    0,
    Number(x.card_count || 0)
    - Number(x.returned_count || 0)
    - Number(x.lost_count || 0)
  );
}

function PAID_COUNT(x){
  return Math.max(
    0,
    Math.min(
      Number(x.lost_count || 0),
      Number(x.paid_count || 0)
    )
  );
}

function UNPAID_LOST(x){
  return Math.max(
    0,
    Number(x.lost_count || 0) - PAID_COUNT(x)
  );
}

function EFFECTIVE_STATUS(x){
  const total = Number(x.card_count || 0);
  const returned = Number(x.returned_count || 0);
  const lost = Number(x.lost_count || 0);
  const paid = PAID_COUNT(x);
  const remaining = REM(x);

  if(x.status === 'cancelled'){
    return 'cancelled';
  }

  // Còn thẻ khách đang giữ -> trạng thái chính vẫn là Đang sử dụng.
  if(remaining > 0){
    return 'active';
  }

  // Không còn thẻ đang giữ, nhưng có thẻ mất.
  if(lost > 0){
    return paid >= lost ? 'paid' : 'lost';
  }

  // Không mất và đã trả đủ.
  if(total > 0 && returned >= total){
    return 'returned';
  }

  return 'active';
}

function REM(x){
  return Math.max(
    0,
    Number(x.card_count || 0)
    - Number(x.returned_count || 0)
    - Number(x.lost_count || 0)
  );
}

function PAID_COUNT(x){
  return Math.max(
    0,
    Math.min(
      Number(x.lost_count || 0),
      Number(x.paid_count || 0)
    )
  );
}

function UNPAID_LOST(x){
  return Math.max(
    0,
    Number(x.lost_count || 0) - PAID_COUNT(x)
  );
}

function EFFECTIVE_STATUS(x){
  const total = Number(x.card_count || 0);
  const returned = Number(x.returned_count || 0);
  const lost = Number(x.lost_count || 0);
  const paid = PAID_COUNT(x);
  const remaining = REM(x);

  if(x.status === 'cancelled') return 'cancelled';
  if(remaining > 0) return 'active';

  if(lost > 0){
    return paid >= lost ? 'paid' : 'lost';
  }

  if(total > 0 && returned >= total){
    return 'returned';
  }

  return 'active';
}

function LOG_LABEL(action){
  const l = L();

  const labels = {
    vi: {
      created: 'Cấp thẻ',
      cards_returned: 'Trả thẻ',
      cards_lost: 'Báo mất',
      compensation_paid: 'Thu phí',
      cancelled: 'Hủy phiếu',
      status_changed: 'Cập nhật trạng thái'
    },

    en: {
      created: 'Card issued',
      cards_returned: 'Card returned',
      cards_lost: 'Card lost',
      compensation_paid: 'Fee collected',
      cancelled: 'Receipt cancelled',
      status_changed: 'Status updated'
    },

    zh: {
      created: '发放房卡',
      cards_returned: '归还房卡',
      cards_lost: '房卡遗失',
      compensation_paid: '收取赔偿费',
      cancelled: '取消确认单',
      status_changed: '更新状态'
    },

    ko: {
      created: '카드 발급',
      cards_returned: '카드 반납',
      cards_lost: '카드 분실',
      compensation_paid: '배상금 수납',
      cancelled: '확인서 취소',
      status_changed: '상태 변경'
    }
  };

  return labels[l]?.[action] || action || '';
}


function LOG_DETAIL(log){
  const l = L();
  const action = String(log.action || '');
  const s = String(log.detail || '');

  /* =====================================================
     CẤP THẺ
     Hỗ trợ:
     "Issued 3 card(s)"
     "Cấp 3 thẻ"
  ===================================================== */
  if(action === 'created'){
    let qty = 0;

    let m = s.match(/Issued\s+(\d+)\s+card/i);

    if(!m){
      m = s.match(/Cấp\s+(\d+)\s+thẻ/i);
    }

    if(m){
      qty = Number(m[1]);
    }

    if(l === 'en'){
      return `Issued ${qty} ${qty === 1 ? 'card' : 'cards'}`;
    }

    if(l === 'zh'){
      return `发放 ${qty} 张房卡`;
    }

    if(l === 'ko'){
      return `객실 카드 ${qty}장 발급`;
    }

    return `Cấp ${qty} thẻ`;
  }


  /* =====================================================
     TRẢ THẺ

     Hỗ trợ log mới:
     "Trả 1 thẻ. Đã trả 2, mất 1, còn 1"

     Hỗ trợ log cũ:
     "Returned 1 card(s). Total returned: 1/4"
  ===================================================== */
  if(action === 'cards_returned'){
    let qty = 0;
    let returned = 0;
    let lost = 0;
    let remaining = 0;

    let m = s.match(
      /Trả\s+(\d+)\s+thẻ.*?Đã trả\s*:?\s*(\d+).*?mất\s*:?\s*(\d+).*?còn\s*:?\s*(\d+)/i
    );

    if(m){
      qty = Number(m[1]);
      returned = Number(m[2]);
      lost = Number(m[3]);
      remaining = Number(m[4]);
    }else{
      m = s.match(
        /Returned\s+(\d+)\s+card(?:\(s\)|s)?.*?Total returned:\s*(\d+)\s*\/\s*(\d+)/i
      );

      if(m){
        qty = Number(m[1]);
        returned = Number(m[2]);

        const total = Number(m[3]);

        remaining = Math.max(
          0,
          total - returned
        );
      }else{
        m = s.match(
          /Trả\s+(\d+)\s+thẻ/i
        );

        if(m){
          qty = Number(m[1]);
        }
      }
    }

    if(l === 'en'){
      return `Returned ${qty} ${qty === 1 ? 'card' : 'cards'}. Returned: ${returned}, lost: ${lost}, remaining: ${remaining}`;
    }

    if(l === 'zh'){
      return `归还 ${qty} 张房卡。已归还：${returned}，遗失：${lost}，剩余：${remaining}`;
    }

    if(l === 'ko'){
      return `객실 카드 ${qty}장 반납. 반납: ${returned}, 분실: ${lost}, 남음: ${remaining}`;
    }

    return `Trả ${qty} thẻ. Đã trả ${returned}, mất ${lost}, còn ${remaining}`;
  }


  /* =====================================================
     BÁO MẤT

     Hỗ trợ:
     "Báo mất thêm 1 thẻ. Tổng mất 2"
     "Báo mất 2 thẻ. Tổng mất 2. Phí phát sinh 400000 VND"
  ===================================================== */
  if(action === 'cards_lost'){
    let qty = 0;
    let totalLost = 0;
    let amount = 0;

    let m = s.match(
      /Báo mất(?: thêm)?\s+(\d+)\s+thẻ/i
    );

    if(m){
      qty = Number(m[1]);
    }

    m = s.match(
      /Tổng mất\s*:?\s*(\d+)/i
    );

    if(m){
      totalLost = Number(m[1]);
    }else{
      totalLost = qty;
    }

    m = s.match(
      /Phí phát sinh\s*:?\s*(\d+)\s*VND/i
    );

    if(m){
      amount = Number(m[1]);
    }

    if(l === 'en'){
      let out =
        `Reported ${qty} lost ${qty === 1 ? 'card' : 'cards'}. Total lost: ${totalLost}`;

      if(amount > 0){
        out += `. Compensation: ${M(amount)}`;
      }

      return out;
    }

    if(l === 'zh'){
      let out =
        `报告遗失 ${qty} 张房卡。累计遗失：${totalLost} 张`;

      if(amount > 0){
        out += `。赔偿费：${M(amount)}`;
      }

      return out;
    }

    if(l === 'ko'){
      let out =
        `${qty}장 분실 신고. 총 분실: ${totalLost}장`;

      if(amount > 0){
        out += `. 배상금: ${M(amount)}`;
      }

      return out;
    }

    let out =
      `Báo mất ${qty} thẻ. Tổng mất ${totalLost}`;

    if(amount > 0){
      out += ` · Phí ${M(amount)}`;
    }

    return out;
  }


  /* =====================================================
     THU PHÍ

     Hỗ trợ log mới:
     "Thu phí 1 thẻ = 200000 VND. Đã thu 1/2 thẻ mất"

     Hỗ trợ log cũ:
     "Đã thu 200000 VND"
  ===================================================== */
  if(action === 'compensation_paid'){
    let qty = 0;
    let amount = 0;
    let paidCount = 0;
    let lostCount = 0;

    let m = s.match(
      /Thu phí\s+(\d+)\s+thẻ/i
    );

    if(m){
      qty = Number(m[1]);
    }

    m = s.match(
      /=\s*(\d+)\s*VND/i
    );

    if(m){
      amount = Number(m[1]);
    }

    if(!amount){
      m = s.match(
        /Đã thu\s+(\d+)\s*VND/i
      );

      if(m){
        amount = Number(m[1]);
      }
    }

    m = s.match(
      /Đã thu\s+(\d+)\s*\/\s*(\d+)\s+thẻ mất/i
    );

    if(m){
      paidCount = Number(m[1]);
      lostCount = Number(m[2]);

      if(!qty){
        qty = 1;
      }
    }

    if(!qty && amount > 0){
      qty = Math.max(
        1,
        Math.round(amount / 200000)
      );
    }

    if(l === 'en'){
      let out =
        `Collected ${M(amount)} for ${qty} lost ${qty === 1 ? 'card' : 'cards'}`;

      if(lostCount > 0){
        out += `. Paid: ${paidCount}/${lostCount} lost cards`;
      }

      return out;
    }

    if(l === 'zh'){
      let out =
        `已收取 ${M(amount)}，对应 ${qty} 张遗失房卡`;

      if(lostCount > 0){
        out += `。已收费：${paidCount}/${lostCount} 张`;
      }

      return out;
    }

    if(l === 'ko'){
      let out =
        `분실 카드 ${qty}장 배상금 ${M(amount)} 수납`;

      if(lostCount > 0){
        out += `. 수납 완료: ${paidCount}/${lostCount}장`;
      }

      return out;
    }

    let out =
      `Thu phí ${qty} thẻ · ${M(amount)}`;

    if(lostCount > 0){
      out += ` · Đã thu ${paidCount}/${lostCount} thẻ mất`;
    }

    return out;
  }


  /* =====================================================
     HỦY PHIẾU
  ===================================================== */
  if(action === 'cancelled'){
    if(l === 'en'){
      return 'Receipt cancelled';
    }

    if(l === 'zh'){
      return '确认单已取消';
    }

    if(l === 'ko'){
      return '확인서가 취소되었습니다';
    }

    return 'Phiếu đã được hủy';
  }


  /* =====================================================
     THAY ĐỔI TRẠNG THÁI CŨ

     Ví dụ:
     "status_changed active → lost"
     "Cập nhật trạng thái: active -> returned"
  ===================================================== */
  if(action === 'status_changed'){
    let from = '';
    let to = '';

    const m = s.match(
      /(active|returned|lost|paid|cancelled)\s*(?:→|->)\s*(active|returned|lost|paid|cancelled)/i
    );

    if(m){
      from = m[1].toLowerCase();
      to = m[2].toLowerCase();
    }

    const maps = {
      vi: {
        active: 'Đang sử dụng',
        returned: 'Đã hoàn trả',
        lost: 'Báo mất',
        paid: 'Đã thu phí',
        cancelled: 'Đã hủy'
      },

      en: {
        active: 'In use',
        returned: 'Returned',
        lost: 'Lost',
        paid: 'Fee paid',
        cancelled: 'Cancelled'
      },

      zh: {
        active: '使用中',
        returned: '已归还',
        lost: '遗失',
        paid: '已收费',
        cancelled: '已取消'
      },

      ko: {
        active: '사용 중',
        returned: '반납 완료',
        lost: '분실',
        paid: '요금 납부',
        cancelled: '취소'
      }
    };

    const map = maps[l] || maps.vi;

    const fromText =
      map[from] || from;

    const toText =
      map[to] || to;

    if(l === 'en'){
      return `Status: ${fromText} → ${toText}`;
    }

    if(l === 'zh'){
      return `状态：${fromText} → ${toText}`;
    }

    if(l === 'ko'){
      return `상태: ${fromText} → ${toText}`;
    }

    return `Trạng thái: ${fromText} → ${toText}`;
  }


  /* =====================================================
     LOG KHÔNG XÁC ĐỊNH
  ===================================================== */

  return s || LOG_LABEL(action);
}
  const logs = historyCache[code];

  if(!logs){
    return `
      <div class="history-box history-loading">
        Đang tải lịch sử...
      </div>
    `;
  }

  if(!logs.length){
    return `
      <div class="history-box">
        <div class="history-title">Lịch sử ${E(code)}</div>
        <div class="history-empty">Chưa có lịch sử thao tác.</div>
      </div>
    `;
  }

  return `
    <div class="history-box">
      <div class="history-title">Lịch sử ${E(code)}</div>
      <div class="history-list">
        ${logs.map(log => `
          <div class="history-item">
            <span class="history-time">${E(DT(log.created_at))}</span>
            <span class="history-dot">—</span>
            <span class="history-action">${E(LOG_LABEL(log.action))}</span>
            <span class="history-detail">${E(LOG_DETAIL(log))}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

async function LOAD_HISTORY(code){
  try{
    const logs = await APIX(
      `${API}/${encodeURIComponent(code)}/logs`,
      {
        headers:{
          'x-admin-pin': $('#adminPin').value
        }
      }
    );

    historyCache[code] = Array.isArray(logs) ? logs : [];
    RA();
  }catch(e){
    historyCache[code] = [{
      action: 'error',
      detail: e.message || 'Không thể tải lịch sử',
      created_at: new Date().toISOString()
    }];
    RA();
  }
}

window.TOGGLE_HISTORY = async code => {
  if(historyOpen.has(code)){
    historyOpen.delete(code);
    RA();
    return;
  }

  historyOpen.add(code);
  RA();

  if(!historyCache[code]){
    await LOAD_HISTORY(code);
  }
};

function RA(){
  if(!$('#adminRows')) return;

  const q = ($('#adminSearch')?.value || '').toLowerCase();
  const f = $('#statusFilter')?.value || '';

  const items = adminItems.map(x => ({
    ...x,
    _effectiveStatus: EFFECTIVE_STATUS(x)
  }));

  const a = items.filter(x =>
    (!f || x._effectiveStatus === f) &&
    JSON.stringify(x).toLowerCase().includes(q)
  );

  $('#countActive').textContent =
    items.filter(x => x._effectiveStatus === 'active').length;

  $('#countReturned').textContent =
    items.filter(x => x._effectiveStatus === 'returned').length;

  $('#countLost').textContent =
    items.filter(x =>
      x._effectiveStatus === 'lost' ||
      x._effectiveStatus === 'paid'
    ).length;

  $('#totalCompensation').textContent = M(
    adminItems.reduce(
      (sum, x) => sum + Number(x.compensation_amount || 0),
      0
    )
  );

  $('#adminRows').innerHTML = a.map(x => {
    const status = x._effectiveStatus;
    const returned = Number(x.returned_count || 0);
    const lost = Number(x.lost_count || 0);
    const paid = PAID_COUNT(x);
    const unpaid = UNPAID_LOST(x);
    const remaining = REM(x);

    const totalFee = Number(x.compensation_amount || lost * 200000);
    const paidFee = paid * 200000;
    const unpaidFee = Math.max(0, totalFee - paidFee);

    let statusExtra = '';

    if(lost > 0){
      if(unpaid > 0){
        statusExtra = `
          <br>
          <small>
            Tổng phí: ${M(totalFee)}
            · Đã thu: ${M(paidFee)}
            · Còn thu: ${M(unpaidFee)}
          </small>
        `;
      }else{
        statusExtra = `
          <br>
          <small>
            ${M(totalFee)} · Đã thu đủ phí
          </small>
        `;
      }
    }

    const mainRow = `
      <tr>
        <td>
          <input
            class="row-check"
            type="checkbox"
            value="${E(x.code)}"
          >
        </td>

        <td>${E(x.code)}</td>
        <td>${E(x.guest_name)}</td>
        <td>${E(x.room_number)}</td>

        <td>
          <b>${Number(x.card_count || 0)}</b>
          <br>
          <small>
            Đã trả: ${returned}
            ${lost > 0 ? ` · Mất: ${lost}` : ''}
            · Còn: ${remaining}
          </small>
        </td>

        <td>${E(DT(x.issued_at))}</td>

        <td>
          <span class="status ${status}">
            ${E(D[L()]?.[status] || status)}
          </span>
          ${statusExtra}
        </td>

        <td class="actions-cell">${AB(x)}</td>
      </tr>
    `;

    const historyRow = historyOpen.has(x.code)
      ? `
        <tr class="history-row">
          <td colspan="8">
            ${HISTORY_HTML(x.code)}
          </td>
        </tr>
      `
      : '';

    return mainRow + historyRow;
  }).join('');

  SA();
}

function AB(x){
  const d = D[L()];
  const remaining = REM(x);
  const lost = Number(x.lost_count || 0);
  const paid = PAID_COUNT(x);
  const unpaid = UNPAID_LOST(x);

  const del = `
    <button
      class="danger small-btn"
      onclick="DEL1('${x.code}')"
    >
      ${d.deleteOne}
    </button>
  `;

  let buttons = '';

  if(x.status !== 'cancelled'){
    if(remaining > 0){
      for(let i = 1; i <= remaining; i++){
        buttons += `
          <button
            class="secondary small-btn"
            onclick="RET('${x.code}',${i})"
          >
            Trả ${i} thẻ
          </button>
        `;
      }

      buttons += `
        <button
          class="danger small-btn"
          onclick="ML('${x.code}',${remaining})"
        >
          ${d.lostAction}
        </button>
      `;
    }

    if(unpaid > 0){
      buttons += `
        <button
          class="primary small-btn"
          onclick="PAY('${x.code}',${unpaid})"
        >
          ${d.paidAction}
        </button>
      `;
    }

    if(
      Number(x.returned_count || 0) === 0 &&
      lost === 0 &&
      paid === 0 &&
      remaining > 0
    ){
      buttons += `
        <button
          class="secondary small-btn"
          onclick="US('${x.code}','cancelled')"
        >
          ${d.cancelAction}
        </button>
      `;
    }
  }

  buttons += del;

  buttons += `
    <button
      class="history-btn small-btn"
      onclick="TOGGLE_HISTORY('${x.code}')"
    >
      ${historyOpen.has(x.code) ? 'Ẩn lịch sử' : 'Lịch sử'}
    </button>
  `;

  return `
    <div class="action-buttons">
      ${buttons}
    </div>
  `;
}

window.RET = async (code, qty) => {
  if(!confirm(`Xác nhận khách đã trả ${qty} thẻ?`)){
    return;
  }

  try{
    await APIX(
      `${API}/${encodeURIComponent(code)}`,
      {
        method:'PATCH',
        headers:{
          'content-type':'application/json',
          'x-admin-pin':$('#adminPin').value
        },
        body:JSON.stringify({
          action:'return_cards',
          returned_count:qty
        })
      }
    );

    delete historyCache[code];
    await LA();

    if(historyOpen.has(code)){
      await LOAD_HISTORY(code);
    }
  }catch(e){
    alert(e.message);
  }
};

window.PAY = async (code, unpaidCount) => {
  if(unpaidCount <= 0){
    return alert('Phiếu này đã thu đủ phí bồi thường');
  }

  const n = prompt(
    `Thu phí cho bao nhiêu thẻ? (1-${unpaidCount})\nMỗi thẻ: 200.000 đ`,
    '1'
  );

  if(n === null) return;

  const qty = Math.max(
    1,
    Math.min(
      unpaidCount,
      Number(n) || 1
    )
  );

  if(!confirm(`Xác nhận đã thu ${M(qty * 200000)} cho ${qty} thẻ?`)){
    return;
  }

  try{
    await APIX(
      `${API}/${encodeURIComponent(code)}`,
      {
        method:'PATCH',
        headers:{
          'content-type':'application/json',
          'x-admin-pin':$('#adminPin').value
        },
        body:JSON.stringify({
          action:'pay_cards',
          paid_count:qty
        })
      }
    );

    delete historyCache[code];
    await LA();

    if(historyOpen.has(code)){
      await LOAD_HISTORY(code);
    }
  }catch(e){
    alert(e.message);
  }
};

function SA(){const a=[...$$('.row-check')],c=a.filter(x=>x.checked),v=a.length>0&&c.length===a.length;$('#selectAllHead').checked=v;$('#selectAllRows').checked=v}function TA(v){$$('.row-check').forEach(x=>x.checked=v);SA()}$('#selectAllHead').onchange=e=>TA(e.target.checked);$('#selectAllRows').onchange=e=>TA(e.target.checked);$('#adminRows').addEventListener('change',e=>{if(e.target.classList.contains('row-check'))SA()});window.ML = async (c, remaining) => {
  if(remaining <= 0){
    return alert('Không còn thẻ nào để báo mất');
  }

  const n = prompt(
    `Số thẻ bị mất (1-${remaining})`,
    '1'
  );

  if(n === null) return;

  const qty = Math.max(
    1,
    Math.min(
      remaining,
      Number(n) || 1
    )
  );

  await PS(c, 'lost', qty);
};
window.US=async(c,s)=>{if(confirm('Xác nhận thay đổi trạng thái?'))await PS(c,s)};async function PS(c,s,lost_count=0){try{await APIX(`${API}/${encodeURIComponent(c)}`,{method:'PATCH',headers:{'content-type':'application/json','x-admin-pin':$('#adminPin').value},body:JSON.stringify({status:s,lost_count})});await LA()}catch(e){alert(e.message)}}window.DEL1=async c=>{if(confirm(`Xóa vĩnh viễn phiếu ${c}?
Thao tác này không thể hoàn tác.`))await DEL([c])};$('#deleteSelected').onclick=async()=>{const c=[...$$('.row-check:checked')].map(x=>x.value);if(!c.length)return alert('Chưa chọn phiếu nào');if(confirm(`Xóa vĩnh viễn ${c.length} phiếu đã chọn?`))await DEL(c)};async function DEL(codes){try{for(const c of codes)await APIX(`${API}/${encodeURIComponent(c)}`,{method:'DELETE',headers:{'x-admin-pin':$('#adminPin').value}});await LA()}catch(e){alert(e.message)}}
