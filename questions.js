// Kimlik Avcısı (The Phish-Tank)
// Bu dosyada çok basit bir bilişim testi için sorular tutulur.

// Her soru yapısı:
// {
//     questionText: "Soru metni",
//     options: ["Seçenek 1", "Seçenek 2", "Seçenek 3"],
//     correctAnswerIndex: 0 // Doğru seçeneğin dizi içindeki indeksi
// }

const questions = [
	{
		questionText: "Aşağıdakilerden hangisi bilgisayarın temel parçalarından biridir?",
		options: ["Klavye", "Defter", "Kalemlik"],
		correctAnswerIndex: 0
	},
	{
		questionText: "İnternet en basit haliyle nedir?",
		options: [
			"Dünyadaki bilgisayarları birbirine bağlayan ağ",
			"Sadece oyun oynamak için kullanılan program",
			"Yalnızca telefon rehberi"
		],
		correctAnswerIndex: 0
	},
	{
		questionText: "Aşağıdakilerden hangisi DOĞRU eşleştirmedir?",
		options: [
			"Dosya = İçinde başka dosyalar tutan yer",
			"Klasör = İçinde dosyalar ve klasörler tutulabilen yer",
			"Klasör = Bir resim ya da metin belgesi"
		],
		correctAnswerIndex: 1
	},
	{
		questionText: "Güvenli bir şifre için aşağıdakilerden hangisi daha uygundur?",
		options: [
			"1234",
			"adim",
			"Harf ve rakam içeren, tahmin edilmesi zor bir ifade"
		],
		correctAnswerIndex: 2
	},
	{
		questionText: "Tarayıcı (web browser) ne işe yarar?",
		options: [
			"İnternette web sitelerini açmaya yarar",
			"Bilgisayarı kapatmaya yarar",
			"Sadece müzik dinlemek için kullanılır"
		],
		correctAnswerIndex: 0
	},
	{
		questionText: "Aşağıdakilerden hangisi bulut depolama (cloud) için DOĞRU bir örnektir?",
		options: [
			"Dosyaları sadece kendi bilgisayarında saklamak",
			"Dosyaları internet üzerinden Google Drive gibi bir hizmette saklamak",
			"Dosyaları sadece USB belleğe kopyalamak"
		],
		correctAnswerIndex: 1
	},
	{
		questionText: "Bir e-posta ekindeki dosyayı açmadan önce aşağıdakilerden hangisine dikkat etmek en doğrusudur?",
		options: [
			"Gönderen kişinin tanıdık ve güvenilir olup olmadığına",
			"Dosyanın adının uzun olup olmadığına",
			"E-postanın gece mi gündüz mü geldiğine"
		],
		correctAnswerIndex: 0
	},
	{
		questionText: "Aşağıdakilerden hangisi güvenli internet kullanımı için ÖNERİLEN bir davranıştır?",
		options: [
			"Parolanı arkadaşlarınla paylaşmak",
			"Tanımadığın sitelere kişisel bilgilerini yazmamak",
			"Her bağlantıya tıklayıp denemek"
		],
		correctAnswerIndex: 1
	},
	{
		questionText: "Bir dosya adının sonunda '.jpg' yazıyorsa bu dosya genellikle ne türdür?",
		options: [
			"Metin belgesi",
			"Resim dosyası",
			"Ses kaydı"
		],
		correctAnswerIndex: 1
	},
	{
		questionText: "Ortak (public) Wi-Fi ağını kullanırken aşağıdakilerden hangisini yapmak DAHA risklidir?",
		options: [
			"Haber sitesi okumak",
			"Bankacılık işlemi yapmak",
			"Hava durumuna bakmak"
		],
		correctAnswerIndex: 1
	},
	{
		questionText: "Dijital ayak izi (digital footprint) neyi ifade eder?",
		options: [
			"Bilgisayarın fiziksel ağırlığını",
			"İnternette geride bıraktığın izleri ve paylaşımları",
			"Klavye tuşlarının sayısını"
		],
		correctAnswerIndex: 1
	}
];
