/* Static interface translations. Model-generated content follows the session language. */
const TRANSLATIONS = {
  en: {
    skip: "Skip to help",
    brand: "Family Tech Support",
    language: "Language",
    eyebrow: "A little help, one step at a time",
    heading: "Let’s figure it out together.",
    lead: "Show me what’s confusing. We’ll check that I understand, then try one small step.",
    describe: "Describe",
    review: "Check understanding",
    try: "Try one step",
    happening: "What’s happening?",
    device: "Which device needs help?",
    windows: "Windows computer",
    android: "Android phone",
    other: "Other device",
    words: "Tell me in your own words",
    hint: "For example: My laptop won’t connect to Wi-Fi. Up to 1,200 characters.",
    screenshot: "Add a screenshot (optional)",
    imagehint:
      "PNG or JPEG, up to 5 MB. Crop and cover private details before using it.",
    readyimage: "Only this edited image will be sent.",
    editimage: "Edit screenshot",
    removeimage: "Remove",
    understand: "Help me understand this",
    local: "Your local helper",
    connection: "Check connection",
    privacytitle: "You’re in control",
    privacy:
      "Questions and edited screenshots go to Ollama on this computer. This app does not save them to disk or send them to a cloud service.",
    secrets: "Never include passwords, bank details or verification codes.",
    before: "Before we try anything",
    understandingtitle: "Did I understand correctly?",
    reviewhint:
      "Edit anything I got wrong. These fields will guide my first answer.",
    problem: "Your problem",
    evidence: "What I noticed",
    uncertainty: "What I’m unsure about",
    confirm: "This is correct — show a step",
    next: "Your next step",
    worked: "That worked!",
    failed: "It didn’t work",
    unclear: "I need an explanation",
    failurenote: "What happened when you tried it?",
    failurehint:
      "We’ll record this as failed before asking for a different step.",
    record: "Record and try another step",
    cancel: "Cancel",
    solved: "You did it! This problem is marked solved.",
    limit: "We’ve reached ten replies. Start a new problem to continue.",
    history: "Steps and results",
    approved: "Understanding you approved",
    reset: "Start a new problem",
    languagehint: "Start a new problem to change the language.",
    caution: "AI can misread a screen. Check each step before following it.",
    expiry:
      "Conversations expire after 30 minutes of inactivity. Start a new problem to clear yours immediately.",
    privatefirst: "Private details first",
    edittitle: "Prepare your screenshot",
    editorhint:
      "Drag a rectangle, then crop or cover it. Zoom changes the view only. You can also enter rectangle coordinates below.",
    zoom: "Zoom",
    undo: "Undo",
    rectangle: "Rectangle in image pixels",
    width: "Width",
    height: "Height",
    crop: "Crop to rectangle",
    redact: "Cover rectangle in black",
    editorprivacy:
      "Black covers remove image pixels. Check the whole image for names and codes. Cancelling keeps your previous screenshot.",
    useimage: "Use this edited screenshot",
    checking: "Checking Gemma…",
    ready: "Gemma is ready on this computer.",
    missing: "Gemma is missing. Run: ollama pull gemma3:4b",
    thinking: "Gemma is thinking. The first reply may take a few minutes.",
    send: "Send my reply",
    followup: "What do you see now?",
    pending: "Not reported yet",
    unclearstatus: "Needs explanation",
    failedstatus: "Failed",
    workedstatus: "Worked",
    reply: "Reply",
    seconds: "seconds",
    imagealt: "Edited screenshot to send",
    selected: "Rectangle selected. Crop or cover it.",
    cropped: "Image cropped. Check the remaining details.",
    redacted: "Selected pixels covered in black.",
    undone: "Last edit undone.",
    emptyundo: "No earlier edits.",
    invalidimage: "Choose a PNG or JPEG up to 5 MB and 16 million pixels.",
    imagelarge: "The edited image is too large. Crop it smaller.",
    imageerror: "This image could not be read. Try another screenshot.",
    badrect: "Choose a rectangle inside the image.",
    noimage: "There is no screenshot to edit.",
    network: "The local app could not be reached. Check that it is running.",
    generic:
      "The request could not be completed. Try again or check the connection.",
    failedreply: "The previous step did not work. Here is what happened: ",
    unclearreply:
      "Please explain the previous step more simply. I have not tried it yet.",
    error_ollama_unavailable:
      "Open Ollama on this computer, then check the connection.",
    error_model_missing: "Download Gemma with: ollama pull gemma3:4b",
    error_model_timeout:
      "Gemma took too long. Wait before retrying; use a shorter message or cropped image.",
    error_model_busy: "Gemma is answering another request. Wait and try again.",
    error_invalid_answer:
      "Gemma returned incomplete information. Please try again.",
    error_model_error:
      "Ollama could not run Gemma. Close other GPU apps or restart with --cpu-only.",
    error_session_missing: "This conversation expired. Start a new problem.",
    error_session_conflict: "This conversation changed. Start a new problem.",
    error_turn_limit: "Ten replies reached. Start a new problem.",
    error_repeated_step:
      "Gemma repeated a failed action. Ask for a different safe step.",
    error_confirmation_required: "Check and confirm the understanding first.",
    error_invalid_request:
      "Check that all fields are filled and within their limits.",
    error_invalid_state: "This action is unavailable in the current stage.",
    error_session_solved: "This problem is solved. Start a new problem.",
    error_session_capacity:
      "Too many open conversations. Close an old problem or wait.",
    error_invalid_image:
      "This screenshot is invalid. Choose another PNG or JPEG.",
    error_image_too_large: "The screenshot is too large. Crop or resize it.",
    error_request_too_large:
      "The request is too large. Use a smaller screenshot.",
  },
  hi: {
    skip: "मदद पर जाएँ",
    brand: "परिवार की तकनीकी मदद",
    language: "भाषा",
    eyebrow: "थोड़ी मदद, एक बार में एक कदम",
    heading: "आइए, मिलकर समझें।",
    lead: "बताएँ कि क्या परेशानी है। पहले हम समस्या समझेंगे, फिर एक छोटा कदम आज़माएँगे।",
    describe: "समस्या बताएँ",
    review: "समझ की जाँच करें",
    try: "एक कदम आज़माएँ",
    happening: "क्या परेशानी हो रही है?",
    device: "किस उपकरण में मदद चाहिए?",
    windows: "Windows कंप्यूटर",
    android: "Android फ़ोन",
    other: "दूसरा उपकरण",
    words: "अपने शब्दों में बताएँ",
    hint: "उदाहरण: मेरा लैपटॉप Wi-Fi से नहीं जुड़ रहा। अधिकतम 1,200 अक्षर।",
    screenshot: "स्क्रीनशॉट जोड़ें (वैकल्पिक)",
    imagehint:
      "PNG या JPEG, अधिकतम 5 MB। इस्तेमाल से पहले निजी जानकारी काटें या ढकें।",
    readyimage: "केवल यह संपादित तस्वीर भेजी जाएगी।",
    editimage: "स्क्रीनशॉट संपादित करें",
    removeimage: "हटाएँ",
    understand: "इसे समझने में मदद करें",
    local: "आपका स्थानीय सहायक",
    connection: "कनेक्शन जाँचें",
    privacytitle: "नियंत्रण आपके हाथ में",
    privacy:
      "सवाल और संपादित स्क्रीनशॉट इसी कंप्यूटर पर Ollama को भेजे जाते हैं। यह ऐप उन्हें डिस्क पर नहीं सहेजता और क्लाउड सेवा को नहीं भेजता।",
    secrets: "पासवर्ड, बैंक की जानकारी या सत्यापन कोड कभी न जोड़ें।",
    before: "कुछ आज़माने से पहले",
    understandingtitle: "क्या मैंने सही समझा?",
    reviewhint:
      "जहाँ मैं गलत हूँ, वहाँ सुधार करें। मेरा पहला जवाब इन बातों पर आधारित होगा।",
    problem: "आपकी समस्या",
    evidence: "मैंने क्या देखा",
    uncertainty: "क्या स्पष्ट नहीं है",
    confirm: "यह सही है — अगला कदम दिखाएँ",
    next: "आपका अगला कदम",
    worked: "यह काम कर गया!",
    failed: "यह काम नहीं किया",
    unclear: "मुझे समझाएँ",
    failurenote: "यह कदम आज़माने पर क्या हुआ?",
    failurehint: "अगला कदम पूछने से पहले इसे असफल के रूप में दर्ज करेंगे।",
    record: "दर्ज करें और दूसरा कदम पूछें",
    cancel: "रद्द करें",
    solved: "आपने कर लिया! समस्या हल के रूप में दर्ज है।",
    limit: "दस जवाब हो चुके हैं। आगे के लिए नई समस्या शुरू करें।",
    history: "कदम और परिणाम",
    approved: "आपकी स्वीकृत समझ",
    reset: "नई समस्या शुरू करें",
    languagehint: "भाषा बदलने के लिए नई समस्या शुरू करें।",
    caution: "AI स्क्रीन को गलत समझ सकता है। हर कदम करने से पहले जाँचें।",
    expiry:
      "30 मिनट तक इस्तेमाल न होने पर बातचीत समाप्त हो जाती है। इसे तुरंत मिटाने के लिए नई समस्या शुरू करें।",
    privatefirst: "पहले निजी जानकारी ढकें",
    edittitle: "स्क्रीनशॉट तैयार करें",
    editorhint:
      "खींचकर आयत चुनें, फिर काटें या ढकें। ज़ूम केवल दृश्य बदलता है। नीचे आयत के निर्देशांक भी भर सकते हैं।",
    zoom: "ज़ूम",
    undo: "पिछला बदलाव हटाएँ",
    rectangle: "तस्वीर के पिक्सेल में आयत",
    width: "चौड़ाई",
    height: "ऊँचाई",
    crop: "चुने आयत तक काटें",
    redact: "आयत को काले रंग से ढकें",
    editorprivacy:
      "काला आवरण तस्वीर के पिक्सेल हटा देता है। पूरे चित्र में नाम और कोड जाँचें। रद्द करने पर पिछला स्क्रीनशॉट बना रहेगा।",
    useimage: "यह संपादित स्क्रीनशॉट इस्तेमाल करें",
    checking: "Gemma की जाँच हो रही है…",
    ready: "Gemma इस कंप्यूटर पर तैयार है।",
    missing: "Gemma नहीं मिला। चलाएँ: ollama pull gemma3:4b",
    thinking: "Gemma सोच रहा है। पहले जवाब में कुछ मिनट लग सकते हैं।",
    send: "मेरा जवाब भेजें",
    followup: "अब आपको क्या दिख रहा है?",
    pending: "अभी परिणाम नहीं बताया",
    unclearstatus: "समझाने की ज़रूरत",
    failedstatus: "असफल",
    workedstatus: "सफल",
    reply: "जवाब",
    seconds: "सेकंड",
    imagealt: "भेजने के लिए संपादित स्क्रीनशॉट",
    selected: "आयत चुना गया। अब काटें या ढकें।",
    cropped: "तस्वीर काट दी गई। बची जानकारी जाँचें।",
    redacted: "चुने पिक्सेल काले रंग से ढक दिए गए।",
    undone: "पिछला बदलाव हटा दिया गया।",
    emptyundo: "कोई पिछला बदलाव नहीं है।",
    invalidimage: "अधिकतम 5 MB और 1.6 करोड़ पिक्सेल का PNG या JPEG चुनें।",
    imagelarge: "संपादित तस्वीर बहुत बड़ी है। इसे और काटें।",
    imageerror: "तस्वीर पढ़ी नहीं जा सकी। दूसरा स्क्रीनशॉट चुनें।",
    badrect: "तस्वीर के भीतर आयत चुनें।",
    noimage: "संपादित करने के लिए स्क्रीनशॉट नहीं है।",
    network: "स्थानीय ऐप से संपर्क नहीं हुआ। जाँचें कि वह चल रहा है।",
    generic: "अनुरोध पूरा नहीं हुआ। दोबारा कोशिश करें या कनेक्शन जाँचें।",
    failedreply: "पिछला कदम काम नहीं किया। यह हुआ: ",
    unclearreply:
      "कृपया पिछला कदम सरल शब्दों में समझाएँ। मैंने अभी उसे आज़माया नहीं है।",
    error_ollama_unavailable:
      "इस कंप्यूटर पर Ollama खोलें, फिर कनेक्शन जाँचें।",
    error_model_missing: "Gemma डाउनलोड करें: ollama pull gemma3:4b",
    error_model_timeout:
      "Gemma ने बहुत समय लिया। दोबारा कोशिश से पहले रुकें; छोटा संदेश या कटी तस्वीर इस्तेमाल करें।",
    error_model_busy:
      "Gemma दूसरे अनुरोध का जवाब दे रहा है। रुककर फिर कोशिश करें।",
    error_invalid_answer: "Gemma ने अधूरी जानकारी दी। फिर कोशिश करें।",
    error_model_error:
      "Ollama Gemma नहीं चला सका। दूसरे GPU ऐप बंद करें या --cpu-only से शुरू करें।",
    error_session_missing: "बातचीत समाप्त हो गई। नई समस्या शुरू करें।",
    error_session_conflict: "बातचीत बदल गई। नई समस्या शुरू करें।",
    error_turn_limit: "दस जवाब पूरे हो गए। नई समस्या शुरू करें।",
    error_repeated_step:
      "Gemma ने असफल कदम दोहराया। कोई दूसरा सुरक्षित कदम पूछें।",
    error_confirmation_required: "पहले समझ की जाँच करके पुष्टि करें।",
    error_invalid_request: "सभी खाने भरें और उनकी सीमा जाँचें।",
    error_invalid_state: "इस चरण में यह काम उपलब्ध नहीं है।",
    error_session_solved: "समस्या हल हो गई। नई समस्या शुरू करें।",
    error_session_capacity:
      "बहुत सी बातचीत खुली हैं। पुरानी बंद करें या प्रतीक्षा करें।",
    error_invalid_image: "यह स्क्रीनशॉट सही नहीं है। दूसरा PNG या JPEG चुनें।",
    error_image_too_large: "स्क्रीनशॉट बहुत बड़ा है। काटें या छोटा करें।",
    error_request_too_large:
      "अनुरोध बहुत बड़ा है। छोटा स्क्रीनशॉट इस्तेमाल करें।",
  },
  gu: {
    skip: "મદદ પર જાઓ",
    brand: "પરિવાર માટે ટેક મદદ",
    language: "ભાષા",
    eyebrow: "થોડી મદદ, એક સમયે એક પગલું",
    heading: "ચાલો, સાથે સમજીએ.",
    lead: "શું મુશ્કેલી છે તે બતાવો. પહેલાં સમસ્યા સમજીએ, પછી એક નાનું પગલું અજમાવીએ.",
    describe: "સમસ્યા જણાવો",
    review: "સમજની ખાતરી કરો",
    try: "એક પગલું અજમાવો",
    happening: "શું મુશ્કેલી થાય છે?",
    device: "કયા ઉપકરણ માટે મદદ જોઈએ?",
    windows: "Windows કમ્પ્યુટર",
    android: "Android ફોન",
    other: "બીજું ઉપકરણ",
    words: "તમારા શબ્દોમાં જણાવો",
    hint: "ઉદાહરણ: મારું લેપટોપ Wi-Fi સાથે જોડાતું નથી. વધુમાં વધુ 1,200 અક્ષર.",
    screenshot: "સ્ક્રીનશૉટ ઉમેરો (વૈકલ્પિક)",
    imagehint:
      "PNG અથવા JPEG, વધુમાં વધુ 5 MB. ઉપયોગ પહેલાં ખાનગી માહિતી કાપો અથવા ઢાંકો.",
    readyimage: "માત્ર આ સંપાદિત ચિત્ર મોકલાશે.",
    editimage: "સ્ક્રીનશૉટ સંપાદિત કરો",
    removeimage: "દૂર કરો",
    understand: "આ સમજવામાં મદદ કરો",
    local: "તમારો સ્થાનિક સહાયક",
    connection: "કનેક્શન તપાસો",
    privacytitle: "નિયંત્રણ તમારા હાથમાં",
    privacy:
      "પ્રશ્નો અને સંપાદિત સ્ક્રીનશૉટ આ કમ્પ્યુટર પર Ollama ને મોકલાય છે. આ એપ તેને ડિસ્ક પર સાચવતી નથી કે ક્લાઉડ સેવાને મોકલતી નથી.",
    secrets: "પાસવર્ડ, બેંકની વિગતો અથવા ચકાસણી કોડ ક્યારેય ઉમેરશો નહીં.",
    before: "કંઈ અજમાવતાં પહેલાં",
    understandingtitle: "શું મેં સાચું સમજ્યું?",
    reviewhint:
      "જ્યાં હું ખોટો હોઉં ત્યાં સુધારો. મારો પહેલો જવાબ આ વિગતો પર આધારિત રહેશે.",
    problem: "તમારી સમસ્યા",
    evidence: "મેં શું જોયું",
    uncertainty: "શું સ્પષ્ટ નથી",
    confirm: "આ સાચું છે — પગલું બતાવો",
    next: "તમારું આગળનું પગલું",
    worked: "આ કામ કરી ગયું!",
    failed: "આ કામ ન કર્યું",
    unclear: "મને સમજાવો",
    failurenote: "આ પગલું અજમાવ્યા પછી શું થયું?",
    failurehint: "બીજું પગલું પૂછતાં પહેલાં આને નિષ્ફળ તરીકે નોંધશું.",
    record: "નોંધો અને બીજું પગલું પૂછો",
    cancel: "રદ કરો",
    solved: "તમે કરી બતાવ્યું! સમસ્યા ઉકેલાઈ ગઈ તરીકે નોંધાઈ છે.",
    limit: "દસ જવાબ થઈ ગયા છે. આગળ વધવા નવી સમસ્યા શરૂ કરો.",
    history: "પગલાં અને પરિણામો",
    approved: "તમે સ્વીકારેલી સમજ",
    reset: "નવી સમસ્યા શરૂ કરો",
    languagehint: "ભાષા બદલવા નવી સમસ્યા શરૂ કરો.",
    caution:
      "AI સ્ક્રીનને ખોટી રીતે સમજી શકે છે. દરેક પગલું કરતાં પહેલાં તપાસો.",
    expiry:
      "30 મિનિટ ઉપયોગ ન થાય તો વાતચીત સમાપ્ત થાય છે. તરત સાફ કરવા નવી સમસ્યા શરૂ કરો.",
    privatefirst: "પહેલાં ખાનગી વિગતો ઢાંકો",
    edittitle: "સ્ક્રીનશૉટ તૈયાર કરો",
    editorhint:
      "ખેંચીને લંબચોરસ પસંદ કરો, પછી કાપો અથવા ઢાંકો. ઝૂમ માત્ર દેખાવ બદલે છે. નીચે લંબચોરસના અંક પણ ભરી શકો છો.",
    zoom: "ઝૂમ",
    undo: "છેલ્લો ફેરફાર પાછો લો",
    rectangle: "ચિત્રના પિક્સેલમાં લંબચોરસ",
    width: "પહોળાઈ",
    height: "ઊંચાઈ",
    crop: "પસંદ કરેલા ભાગ સુધી કાપો",
    redact: "લંબચોરસને કાળા રંગથી ઢાંકો",
    editorprivacy:
      "કાળું આવરણ ચિત્રના પિક્સેલ દૂર કરે છે. આખા ચિત્રમાં નામ અને કોડ તપાસો. રદ કરવાથી પહેલાંનો સ્ક્રીનશૉટ રહેશે.",
    useimage: "આ સંપાદિત સ્ક્રીનશૉટ વાપરો",
    checking: "Gemma ની તપાસ થાય છે…",
    ready: "Gemma આ કમ્પ્યુટર પર તૈયાર છે.",
    missing: "Gemma મળ્યું નથી. ચલાવો: ollama pull gemma3:4b",
    thinking: "Gemma વિચારી રહ્યું છે. પહેલા જવાબમાં થોડી મિનિટ લાગી શકે છે.",
    send: "મારો જવાબ મોકલો",
    followup: "હવે તમને શું દેખાય છે?",
    pending: "હજી પરિણામ જણાવ્યું નથી",
    unclearstatus: "સમજાવવાની જરૂર",
    failedstatus: "નિષ્ફળ",
    workedstatus: "સફળ",
    reply: "જવાબ",
    seconds: "સેકન્ડ",
    imagealt: "મોકલવા માટેનો સંપાદિત સ્ક્રીનશૉટ",
    selected: "લંબચોરસ પસંદ થયો. હવે કાપો અથવા ઢાંકો.",
    cropped: "ચિત્ર કાપ્યું છે. બાકી વિગતો તપાસો.",
    redacted: "પસંદ કરેલા પિક્સેલ કાળા રંગથી ઢાંક્યા છે.",
    undone: "છેલ્લો ફેરફાર પાછો લીધો.",
    emptyundo: "કોઈ અગાઉનો ફેરફાર નથી.",
    invalidimage:
      "વધુમાં વધુ 5 MB અને 1.6 કરોડ પિક્સેલનું PNG અથવા JPEG પસંદ કરો.",
    imagelarge: "સંપાદિત ચિત્ર બહુ મોટું છે. તેને વધુ કાપો.",
    imageerror: "ચિત્ર વાંચી શકાયું નહીં. બીજો સ્ક્રીનશૉટ પસંદ કરો.",
    badrect: "ચિત્રની અંદર લંબચોરસ પસંદ કરો.",
    noimage: "સંપાદિત કરવા સ્ક્રીનશૉટ નથી.",
    network: "સ્થાનિક એપ સાથે સંપર્ક થયો નહીં. તે ચાલુ છે કે નહીં તપાસો.",
    generic: "વિનંતી પૂરી થઈ નહીં. ફરી પ્રયત્ન કરો અથવા કનેક્શન તપાસો.",
    failedreply: "પાછલું પગલું કામ ન કર્યું. આ થયું: ",
    unclearreply:
      "કૃપા કરીને પાછલું પગલું સરળ શબ્દોમાં સમજાવો. મેં હજી તે અજમાવ્યું નથી.",
    error_ollama_unavailable: "આ કમ્પ્યુટર પર Ollama ખોલો, પછી કનેક્શન તપાસો.",
    error_model_missing: "Gemma ડાઉનલોડ કરો: ollama pull gemma3:4b",
    error_model_timeout:
      "Gemma ને વધુ સમય લાગ્યો. ફરી પ્રયાસ પહેલાં રાહ જુઓ; નાનો સંદેશ અથવા કાપેલું ચિત્ર વાપરો.",
    error_model_busy:
      "Gemma બીજી વિનંતીનો જવાબ આપે છે. રાહ જોઈ ફરી પ્રયત્ન કરો.",
    error_invalid_answer: "Gemma એ અધૂરી માહિતી આપી. ફરી પ્રયત્ન કરો.",
    error_model_error:
      "Ollama Gemma ચલાવી શક્યું નહીં. બીજી GPU એપ બંધ કરો અથવા --cpu-only થી શરૂ કરો.",
    error_session_missing: "વાતચીત સમાપ્ત થઈ. નવી સમસ્યા શરૂ કરો.",
    error_session_conflict: "વાતચીત બદલાઈ ગઈ. નવી સમસ્યા શરૂ કરો.",
    error_turn_limit: "દસ જવાબ થઈ ગયા. નવી સમસ્યા શરૂ કરો.",
    error_repeated_step:
      "Gemma એ નિષ્ફળ પગલું ફરી આપ્યું. બીજું સુરક્ષિત પગલું પૂછો.",
    error_confirmation_required: "પહેલાં સમજ તપાસીને ખાતરી કરો.",
    error_invalid_request: "બધા ખાના ભરો અને તેમની મર્યાદા તપાસો.",
    error_invalid_state: "આ તબક્કે આ કામ ઉપલબ્ધ નથી.",
    error_session_solved: "સમસ્યા ઉકેલાઈ ગઈ. નવી સમસ્યા શરૂ કરો.",
    error_session_capacity: "ઘણી વાતચીત ખુલ્લી છે. જૂની બંધ કરો અથવા રાહ જુઓ.",
    error_invalid_image: "આ સ્ક્રીનશૉટ યોગ્ય નથી. બીજો PNG અથવા JPEG પસંદ કરો.",
    error_image_too_large: "સ્ક્રીનશૉટ બહુ મોટો છે. કાપો અથવા નાનો કરો.",
    error_request_too_large: "વિનંતી બહુ મોટી છે. નાનો સ્ક્રીનશૉટ વાપરો.",
  },
};
class LanguageService {
  constructor() {
    this.language = "en";
  }
  text(key) {
    return TRANSLATIONS[this.language][key] || TRANSLATIONS.en[key] || key;
  }
  apply(language) {
    this.language = language;
    document.documentElement.lang = language;
    document.title = this.text("brand");
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = this.text(el.dataset.i18n);
    });
    document
      .querySelector(".progress")
      .setAttribute("aria-label", this.text("review"));
    document
      .querySelector("#edit-canvas")
      .setAttribute("aria-label", this.text("rectangle"));
    document.querySelector("#preview").alt = this.text("imagealt");
  }
}

Object.assign(TRANSLATIONS.en, {
  previous: "Previous solutions",
  savehistory: "Save this chat on this PC",
  savehint:
    "Text is saved in a local database until you delete it. Screenshots are never saved. Uncheck for a temporary chat.",
  historyprivacy:
    "Saved text stays on this PC until deleted. Starting a new problem does not delete saved chats. Advice may not fit a new problem.",
  close: "Close",
  searchhistory: "Search saved chats",
  search: "Search",
  more: "Load more",
  historyloading: "Loading saved chats…",
  historyempty: "No saved chats found.",
  openchat: "View chat",
  deletechat: "Delete chat",
  deleteconfirm:
    "Delete this saved chat? Deleting the active chat also stops further saving for it.",
  readonly:
    "Saved history is read-only. Start a new problem for fresh help. Previous advice is not automatically reused.",
  unconfirmed: "Not confirmed solved",
  error_history_missing: "This saved chat was deleted or is unavailable.",
  error_history_storage_error:
    "Cannot access local history. Check disk space and database folder permissions.",
});
Object.assign(TRANSLATIONS.hi, {
  previous: "पिछले समाधान",
  savehistory: "यह बातचीत इस कंप्यूटर पर सहेजें",
  savehint:
    "पाठ स्थानीय डेटाबेस में आपके मिटाने तक रहेगा। स्क्रीनशॉट नहीं सहेजे जाते। अस्थायी बातचीत के लिए चयन हटाएँ।",
  historyprivacy:
    "सहेजा पाठ इस कंप्यूटर पर मिटाने तक रहेगा। नई समस्या शुरू करने से सहेजी बातचीत नहीं मिटती। पुरानी सलाह नई समस्या पर लागू न भी हो सकती है।",
  close: "बंद करें",
  searchhistory: "सहेजी बातचीत खोजें",
  search: "खोजें",
  more: "और दिखाएँ",
  historyloading: "सहेजी बातचीत लोड हो रही है…",
  historyempty: "कोई सहेजी बातचीत नहीं मिली।",
  openchat: "बातचीत देखें",
  deletechat: "बातचीत मिटाएँ",
  deleteconfirm:
    "यह सहेजी बातचीत मिटाएँ? चालू बातचीत मिटाने पर आगे उसे सहेजना भी बंद होगा।",
  readonly:
    "सहेजी बातचीत केवल पढ़ सकते हैं। नई मदद के लिए नई समस्या शुरू करें। पुरानी सलाह अपने आप इस्तेमाल नहीं होती।",
  unconfirmed: "हल होने की पुष्टि नहीं हुई",
  error_history_missing: "यह सहेजी बातचीत मिट गई है या उपलब्ध नहीं है।",
  error_history_storage_error:
    "स्थानीय इतिहास नहीं खुल सका। डिस्क की जगह और डेटाबेस फ़ोल्डर की अनुमति जाँचें।",
});
Object.assign(TRANSLATIONS.gu, {
  previous: "અગાઉના ઉકેલો",
  savehistory: "આ વાતચીત આ કમ્પ્યુટર પર સાચવો",
  savehint:
    "લખાણ સ્થાનિક ડેટાબેસમાં તમે કાઢો ત્યાં સુધી રહેશે. સ્ક્રીનશૉટ સાચવાતા નથી. કામચલાઉ વાતચીત માટે પસંદગી દૂર કરો.",
  historyprivacy:
    "સાચવેલું લખાણ આ કમ્પ્યુટર પર કાઢો ત્યાં સુધી રહેશે. નવી સમસ્યા શરૂ કરવાથી સાચવેલી વાતચીત દૂર થતી નથી. જૂની સલાહ નવી સમસ્યાને લાગુ ન પણ પડે.",
  close: "બંધ કરો",
  searchhistory: "સાચવેલી વાતચીત શોધો",
  search: "શોધો",
  more: "વધુ બતાવો",
  historyloading: "સાચવેલી વાતચીત લોડ થાય છે…",
  historyempty: "કોઈ સાચવેલી વાતચીત મળી નથી.",
  openchat: "વાતચીત જુઓ",
  deletechat: "વાતચીત દૂર કરો",
  deleteconfirm:
    "આ સાચવેલી વાતચીત દૂર કરવી છે? ચાલુ વાતચીત દૂર કરવાથી આગળ તેને સાચવવાનું પણ બંધ થશે.",
  readonly:
    "સાચવેલી વાતચીત માત્ર વાંચી શકાય છે. નવી મદદ માટે નવી સમસ્યા શરૂ કરો. જૂની સલાહ આપમેળે વપરાતી નથી.",
  unconfirmed: "ઉકેલની ખાતરી થઈ નથી",
  error_history_missing: "આ સાચવેલી વાતચીત દૂર થઈ છે અથવા ઉપલબ્ધ નથી.",
  error_history_storage_error:
    "સ્થાનિક ઇતિહાસ ખૂલી શક્યો નથી. ડિસ્કની જગ્યા અને ડેટાબેસ ફોલ્ડરની પરવાનગી તપાસો.",
});
TRANSLATIONS.en.privacy =
  "Questions and edited screenshots go to Ollama on this computer. With saving enabled, chat text stays in a local SQLite database. Screenshots are never saved to disk by this app.";
TRANSLATIONS.hi.privacy =
  "सवाल और संपादित स्क्रीनशॉट इसी कंप्यूटर पर Ollama को जाते हैं। सहेजना चालू होने पर बातचीत का पाठ स्थानीय SQLite डेटाबेस में रहता है। यह ऐप स्क्रीनशॉट डिस्क पर नहीं सहेजता।";
TRANSLATIONS.gu.privacy =
  "પ્રશ્નો અને સંપાદિત સ્ક્રીનશૉટ આ કમ્પ્યુટર પર Ollama ને જાય છે. સાચવવાનું ચાલુ હોય તો વાતચીતનું લખાણ સ્થાનિક SQLite ડેટાબેસમાં રહે છે. આ એપ સ્ક્રીનશૉટ ડિસ્ક પર સાચવતી નથી.";
TRANSLATIONS.en.expiry =
  "Live sessions expire after 30 minutes of inactivity. Saved text remains until deleted from Previous solutions.";
TRANSLATIONS.hi.expiry =
  "30 मिनट इस्तेमाल न होने पर चालू बातचीत समाप्त होती है। सहेजा पाठ पिछले समाधान से मिटाने तक रहेगा।";
TRANSLATIONS.gu.expiry =
  "30 મિનિટ ઉપયોગ ન થાય તો ચાલુ વાતચીત સમાપ્ત થાય છે. સાચવેલું લખાણ અગાઉના ઉકેલોમાંથી કાઢો ત્યાં સુધી રહેશે.";
