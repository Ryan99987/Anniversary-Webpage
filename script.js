let currentPlayingVideo = null;
let wasMusicPlayingBeforeVideo = false;
let isUserSelection = false;

document.addEventListener('DOMContentLoaded', function() {
    const musicTracks = [
        { name: "တို့အိမ်ပြန်ချိန်လေးများ", path: "./photos/musics/background.mp3" },
        { name: "နှစ်ပတ်လည်", path: "./photos/musics/background2.mp3" },
        { name: "LDRS", path: "./photos/musics/background3.mp3" }
      ];
      
      const audio = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const nowPlaying = document.getElementById('now-playing');
const trackSelector = document.getElementById('track-selector');

let currentTrack = 0;

function initMusicPlayer() {
    audio.volume = 0.5;
    audio.loop = false;
    
    loadTrack(0);
    
    // Music controls
    toggleBtn.addEventListener('click', togglePlay);
    
    trackSelector.addEventListener('change', function() {
        isUserSelection = true;
        currentTrack = parseInt(this.value);
        loadTrack(currentTrack);
        if (!audio.paused) audio.play();
    });
    
    audio.addEventListener('ended', handleTrackEnd);
    
    // Video integration
    document.querySelectorAll('video').forEach(video => {
        video.addEventListener('play', function() {
            if (!audio.paused) {
                wasMusicPlayingBeforeVideo = true;
                audio.pause();
                toggleBtn.textContent = "▶";
            }
            
            // Pause other videos
            document.querySelectorAll('video').forEach(v => {
                if (v !== video && !v.paused) v.pause();
            });
            
            currentPlayingVideo = video;
        });
        
        video.addEventListener('pause', function() {
            if (this === currentPlayingVideo) {
                if (wasMusicPlayingBeforeVideo && audio.paused) {
                    audio.play().then(() => {
                        toggleBtn.textContent = "❚❚";
                    });
                }
                currentPlayingVideo = null;
            }
        });
        
        video.addEventListener('ended', function() {
            if (wasMusicPlayingBeforeVideo && audio.paused) {
                audio.play().then(() => {
                    toggleBtn.textContent = "❚❚";
                });
            }
            wasMusicPlayingBeforeVideo = false;
            currentPlayingVideo = null;
        });
    });
}

function loadTrack(index) {
    currentTrack = index;
    const track = musicTracks[index];
    
    trackSelector.value = index;
    audio.src = track.path;
    
    if (!audio.paused) {
        nowPlaying.textContent = track.name;
        toggleBtn.textContent = "❚❚";
    } else {
        nowPlaying.textContent = "";
        toggleBtn.textContent = "▶";
    }
}

function togglePlay() {
    if (audio.paused) {
        // If any video is playing, pause it first
        if (currentPlayingVideo) {
            currentPlayingVideo.pause();
            currentPlayingVideo = null;
        }
        
        audio.play()
            .then(() => {
                toggleBtn.textContent = "❚❚";
                nowPlaying.textContent = musicTracks[currentTrack].name;
            })
            .catch(e => {
                nowPlaying.textContent = "Click to play";
            });
    } else {
        audio.pause();
        toggleBtn.textContent = "▶";
    }
}

function handleTrackEnd() {
    if (!isUserSelection) {
        currentTrack = (currentTrack + 1) % musicTracks.length;
        loadTrack(currentTrack);
        if (!audio.paused || wasMusicPlayingBeforeVideo) {
            audio.play();
            wasMusicPlayingBeforeVideo = false;
        }
    }
    isUserSelection = false;
}

window.addEventListener('DOMContentLoaded', initMusicPlayer);

document.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', function() {
      // Pause music when video plays
      if (!audio.paused) {
        audio.pause();
        wasMusicPlayingBeforeVideo = true;
        toggleBtn.textContent = "▶";
      }
      
      // Pause other videos
      document.querySelectorAll('video').forEach(v => {
        if (v !== video && !v.paused) v.pause(); 
      });
      
      currentPlayingVideo = video;
    });
  
    video.addEventListener('pause', function() {
      // Resume music when video pauses (if music was playing before)
      if (wasMusicPlayingBeforeVideo && !currentPlayingVideo) {
        audio.play()
          .then(() => {
            toggleBtn.textContent = "❚❚";
          })
          .catch(e => {
            console.log("Audio playback error:", e);
          });
      }
    });
  
    video.addEventListener('ended', function() {
      // Resume music when video ends (if music was playing before)
      if (wasMusicPlayingBeforeVideo) {
        audio.play()
          .then(() => {
            toggleBtn.textContent = "❚❚";
          });
      }
      wasMusicPlayingBeforeVideo = false;
      currentPlayingVideo = null;
    });
  });


    // Navigation
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active-section'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('href');
            document.querySelector(sectionId).classList.add('active-section');
            
            // Scroll to top of section
            document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Photo Gallery
    const yearButtons = document.querySelectorAll('.year-btn');
    const yearGalleries = document.querySelectorAll('.year-gallery');
    
    yearButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and galleries
            yearButtons.forEach(btn => btn.classList.remove('active'));
            yearGalleries.forEach(gallery => gallery.classList.remove('active-gallery'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding gallery
            const year = this.getAttribute('data-year');
            document.getElementById(`${year}-gallery`).classList.add('active-gallery');
            
            // Load photos if not already loaded
            if (document.getElementById(`${year}-gallery`).children.length === 0) {
                loadPhotos(year);
            }
        });
    });
    
    // Load initial photos for 2023
    loadPhotos('2023');
    // Modal functionality
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const captionText = document.querySelector('.caption');
    const closeModal = document.querySelector('.close');
    
    // This would be called when a gallery item is clicked
    function openModal(imgSrc, caption, note) {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-image');
        const captionText = document.querySelector('.modal .caption');
        const noteText = document.querySelector('.modal .note'); // New note element

        modal.style.display = "block";
        modalImg.src = imgSrc;
        captionText.textContent = caption;
        noteText.textContent = note;
    }
    
    closeModal.addEventListener('click', function() {
        modal.style.display = "none";
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
    
    
   // Replace the loadPhotos function with this version
function loadPhotos(year) {
    const gallery = document.getElementById(`${year}-gallery`);
    gallery.innerHTML = '';

    // Photo data with captions - customize these!
    const photoData = {
        '2023': [
            { filename: 'photo 1.jpg', caption: 'Our very first day "water festival"', 
                note: '"ပထမဆုံးနေ့က ရင်တွေအရမ်းခုန်ခဲ့တယ် nervous လဲဖြစ်တယ် အဲ့မနက်ထိ ကိုယ့်ကိုကိုယ်မယုံသေးဘူး အိမ်မက်လားလို့ အဲ့ချိန်မှာအခန်းထဲကလူတွေအထင်ကြီးတဲ့အကြည့်က တကယ် proud ဖြစ်တယ်" '},
            { filename: 'photo 2.jpg', caption: 'Bar Date',
                note: '"အဲ့ဘားလေးကို သဘောကျတယ်. ချစ်နဲ့ကိုကိုလဲအစက လိုက်သွားဖို့အစီအစဉ်မရှိဘဲလိုက်သွားဖြစ်တာနော် ပြန်ထိုင်ချင်တယ်"'
             },
            { filename: 'photo 3.jpg', caption: 'First gift "Couple Bracelet"',
                note: '🎁 "ချစ်က ကိုကို့ ကိုလက်ဆောင်အရင်ပေးခဲ့တာနော် အဲ့တာက ထူးဆန်းတယ်မလား ကိုလဲ အဲ့တုန်းကမထင်မှတ်ထားဘူး အရမ်းနှမြောတယ် အမှတ်တရလေးပါ"'
            },
            { filename: 'photo 4.jpg', caption: 'Cards & Coffee Date',
                note: '"အဲ့တုန်းက ဖူးဖူးကောပါတယ်နော် ကဒ် game တွေကတကယ်ဆော့လို့ကောင်းခဲ့တယ်။ ပြန်ဆော့ချင်လိုက်တာ"'
            },
            { filename: 'photo 5.jpg', caption: 'Pizza Date',
                note: '"အဲ့တုန်းက မှတ်မိပါသေးတယ် ပီဇာနှစ်ချက်ကို ၇ယောက်စားကြတာလေ အဲ့လိုပြန်သွားဖို့မဖြစ်နိုင်တော့ဘူး"'
            },
            { filename: 'photo 6.jpg', caption: 'Video Call Date',
                note: '"video call ခေါ်ရင်း ဓာတ်ပုံရိုက်မယ်ဆိုတော့ effect အသည်းအသန်ပြေးထည့်ရတာ ဗိုက်ပူက"'
            },
            { filename: 'photo 7.jpg', caption: 'Group Movie Date',
                note: '"အဲ့တုန်းက ဘာကားကြည့်ကြတာလဲ haha မှတ်မိပါသေးတယ် အံ့ဘုန်းမြတ်ပြောတာ မှတ်မိသေးလား"'
            },
            { filename: 'photo 8.jpg', caption: 'Our First Trip First Day',
                note: '"ကိုကို ကလော trip မှာအကြိုက်ဆုံးပုံပဲ နောက်ကကားကြီးနဲ့ ဂေါ်တယ်နော်"'
            },
            { filename: 'photo 9.jpg', caption: 'Second Day',
                note: '"အဲ့တုန်းက သေချာတောင်မရိုက်ခဲ့ရဘူးနော် ဒါပင်မဲ့ ချစ်ကလှပြီးသားဆိုတော့ ဓာတ်ပုံကောင်းကောင်းထွက်လာတာပေါ့"'
            },
            { filename: 'photo 10.jpg', caption: 'Third Day',
                note: '"နောက်တစ်ချိန်ကြရင် အဲ့နေရာလေးတွေ ပြန်သွားပြီး ဓာတ်ပုံဆင်တူလေးရိုက်ချင်တယ်နော်"'
            },
            { filename: 'photo 11.jpg', caption: 'Golden Robe Donation',
                note: '"ဘုရားရောက်တိုင်းဘာတွေဆုတောင်းဖြစ်တုန်း"'
            },
            { filename: 'photo 12.jpg', caption: 'Wander around Ancient Temple',
                note: '"အဲ့ပုံလေးတစ်ပုံရဖို့ ကျေးဇူးရှင်တွေကို အာပေါက်အောင်ပြောရတယ်နော် ပါးကွက်နဲ့လှနေတာ"'
            },
            { filename: 'photo 13.jpg', caption: 'Night in Kalaw',
                note: '"မှတ်မိသေးလား စက်ဘီးတင်စီးတာကို ကြောက်ပြီးစိတ်ဆိုးတာလေ ဟိုကောင်တွေမြှောက်ပေးလို့ ချီပြီးရိုက်ထားတာ ဝါးနေလို့ အဲ့ပုံလေးပိုကြိုက်တာ"'
            },
            { filename: 'photo 14.jpg', caption: 'Foodie Date',
                note: '"အဲ့တုန်းက ပြည့်စုံနဲ့လက်ဖက်ရည်ဆိုင်ထိုင်ပြီး ရုပ်ရှင်ကြည့်ကြတာမလား ဘာကားလဲမှန်အောင်ဖြေ"'
            },
            { filename: 'photo 15.jpg', caption: 'Second Bracelet',
                note: '"ဒုတိယ လက်ပတ်လေး အမဲလေးကိုပိုကြိုက်တယ် ဒါလေးလဲတူတူပဲ နှမြောတယ်"'
            },
            { filename: 'photo 16.jpg', caption: 'The Bachelor Farewell',
                note: '"Bachelor နောက်ဆုံးနေ့ မှတ်မိသေးလား နောက်နေ့က ကိုကို Gym ဆော့တော့မယ်ပြောတာလေ အဲ့ထဲမှာ ပိန်လွန်းလို့"'
             },
            { filename: 'photo 18.jpg', caption: 'Chill Out',
                note: '"အဲ့ ဂါဝန်လေးကိုအကြိုက်ဆုံးပဲ ချစ်လေးနဲ့လဲလိုက်တယ် ဆိုးတာချစ်ကထပ်မဝတ်ဘူး မကျေနပ်ဘူး"'
            },
            { filename: 'photo 20.jpg', caption: 'University Snaps',
                note: '"info အသံတိတ်လူမိုက်များ"'
            },
            { filename: 'photo 21.jpg', caption: 'Golden Wishes at Shwedagon',
                note: '"အဲ့တုန်းက ပုံတွေအကုန်လိုချင်ခဲ့တာ ခုသေချာကြည့်မှ ကိုကိုက တစ်ပုံမှမလှဘူး"'
            },
            { filename: 'photo 23.jpg', caption: 'Our Half Anniversary',
                note: '"မွေးနေ့ပြီးခြောက်လပြည့် သူ့ကိတ်ပြန်ကျွေးရတယ်"'
            },
            { filename: 'photo 24.jpg', caption: 'The Shining Star',
                note: '"shining ဖြစ်ချက်ပဲနော် အရမ်းလှ"'
            },
            { filename: 'photo 25.jpg', caption: 'Love on the Move',
                note: '"အရင်လို အိမ်ပြန်ချိန်တွေ တူတူကားစီးချင်တယ် အရမ်းလွမ်းတယ် သဲလေး"'
            },
            { filename: 'photo 26.jpg', caption: 'Campus Click',
                note: '"အားနေဓာတ်ပုံရိုက်တယ်နော် ကိုကိုမျက်မှန်အသစ်လေးနဲ့"'
            },
            { filename: 'photo 27.jpg', caption: 'Our 7th Month Anniversary',
                note: '"၇လပြည့် ကိုယ်တိုင်စီး ပန်းစည်းလေးနဲ့ ချစ်ပေးတဲ့ဉီးထုပ်လေးလဲကြိုက်တယ်"'
            },
            { filename: 'photo 28.jpg', caption: 'Hlawga Lake Trip',
                note: '"အဲ့ one set လေးလဲကြိုက်တယ် ချစ်လေးနဲ့လိုက်တယ် အရမ်း"'
            },
            { filename: 'photo 29.jpg', caption: 'Cozy December',
                note: '"December အချိန်တွေဆိုပျော်ဖို့ကောင်းတယ်နော် ပွဲလမ်းသဘင်တွေလဲရှိ ကျောင်းလာရတာအဲ့အချိန်တွေအပျော်ဆုံးပဲ"'
            },
            { filename: 'photo 30.jpg', caption: 'Our 8th Month Anniversary "Couple Hoodie"',
                note: "၂၀၂၃ ရဲံ နောက်ဆုံး anniversary couple hoodie နဲ့"
            }
        ],
        '2024': [
            { filename: 'photo 1.jpg', caption: 'Happy birthday Lovely',
                note: '"ကိုကို့ချစ်လေး မွေးနေ့ နောက်မွေးနေ့တွေ အမှတ်တရနေ့တွေကျ တူတူဖြတ်သန်းရအောင်ကြိုးစားမယ်"'
             },
            { filename: 'photo 2.jpg', caption: 'The day my precious one was born ',
                note: '"ဂါဝန်အဖြူလေးနဲ့ အရမ်းလှသော ချစ်သူ ဒီမွေးနေ့မှတော့ အတူတူမရှိပေးနိုင်ခဲ့လို့ စိတ်မကောင်းဖြစ်ရပါတယ်"'
             },
            { filename: 'photo 3.jpg', caption: 'KFC Date',
                note: '"အဲ့နေ့က ကိုကိုတို့ Taxi စောင့်ရင်း KFC စားကြတာနော် သတိရတယ် မုန့်တွေအတူတူပြန်စားချင်ပြီ"'
             },
            { filename: 'photo 4.jpg', caption: 'Valentine\'s Day surprise',
                note: '"Happy Valentine ဖြစ်ခဲ့ပါတယ် ချစ်လေးကျွေးတဲ့ cake လေးတွေအရမ်းကြိုက်တယ်"'
             },
            { filename: 'photo 5.jpg', caption: 'Taste of Japan Together ',
                note: '"နိုင်ငံပေါင်းစုံရဲ့ culture and dress တွေကိုဝတ်ပြီး တူတူကမ္ဘာပတ်ချင်တယ် ချစ်ရေ"'
             },
            { filename: 'photo 6.jpg', caption: 'Anniversary suprise gift',
                note: '"အဲ့နာရီလေးက ချစ်လေးကိုယ်ပွားအနေနဲ့ ကိုကိုဘေးမှာအမြဲရှိနေတယ်နော်"'
             },
            { filename: 'photo 7.jpg', caption: 'Picture Perfect Date',
                note: '"နောက်တစ်ခေါက်ထပ်ရိုက်ကြမယ်နော် ဒီထပ်ပိုလှတဲ့ပုံလေးတွေ"'
             },
            { filename: 'photo 9.jpg', caption: 'Bake Together',
                note: '"Flour, sugar and a sprinkle of love"'
             },
            { filename: 'photo 10.jpg', caption: 'Zoo Date',
                note: '"အဲ့နေ့က ကိုကိုနောင်တရတာ ဓာတ်ပုံတွေအများကြီးမရိုက်ခဲ့ရဘူး ခုလိုချိန်မှ နောင်တရမိတယ်"'
             },
            { filename: 'photo 11.jpg', caption: 'staycation Date',
                note: '"သူငယ်ချင်းတွေနဲ့ တူတူချက်ပြုတ် စားသောက်ပြီး ညအိပ်ခရီးတွေလဲ သွားချင်တယ် ဗိုက်ပူ"'
             },
            { filename: 'photo 13.jpg', caption: 'From Students to Graduates',
                note: '"Hons ကြီးပြီးသွားတော့ အရင်လို အပြင်တွေထွက်လို့မရတော့တာ ရင်အနာဆုံးပဲနော်"'
             },
            { filename: 'photo 14.jpg', caption: 'Breadtalk Date',
                note: '"မုန့်တွေစားလိုက် အပြင်တွေတူတူလျှောက်လည်လိုက်နဲ့ ပေါ့ပေါ့ပါးပါးဖြတ်သန်းရတာပျော်ဖို့ကောင်းတယ်"'
             },
            { filename: 'photo 15.jpg', caption: 'Bus Date',
                note: '"ကိုကိုတို့ အကြာကြီးနေမှ bus ကိုအဝေးစီးဖူးတာနော် ကိုကိုနေမကောင်းလို့ မာလာထန် အဖြူထည်ကြီးစားရတာ ချစ်ကကြိတ်မှိတ်စားတာထင်ပါတယ်"'
             },
            { filename: 'photo 16.jpg', caption: 'Dagon University Date',
                note: '"ကြားထဲ တွေ့ရအောင် အမျိုးစုံကြိုးခုန်ပြီး dagon တက်"'
             },
            { filename: 'photo 17.jpg', caption: 'Proud of You',
                note: '"ကိုကိုချစ်လေး outstanding award ရတာ တော်တယ်နော် ကိုကို ကတိတွေမတည်နိုင်ခဲ့လို့ တောင်းပန်ပါတယ်နော်"'
             },
            
        ],
        '2025': [
            { filename: 'photo 1.jpg', caption: 'Happy 22th birthday',
                note: '"မွေးနေ့မှာတူတူမရှိပေးနိုင်ခဲ့ဘူး ဒါပင်မဲ့ ကိုကိုရင်ထဲမှာအမြဲရှိတယ်နော်"'
             },
            { filename: 'photo 2.jpg', caption: 'Video call & Longing',
                note: '"Miles apart, but always close at heart."'
             },
            { filename: 'photo 3.jpg', caption: 'Latest Photo',
                note: '"ကိုကိုချစ်လေးကို assignment ကာလအတွင်းမို့ပြစ်ထားသလိုဖြစ်နေတာမို့ တောင်းပန်ပါတယ် အများကြီးပိုချစ်ကြမယ်နော်"'
             },
    
        ]
    };

    photoData[year].forEach(photo => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        // Create image container
        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';
        
        // Create image element
        const img = document.createElement('img');
        img.src = `photos/${year}/${photo.filename}`;
        img.alt = `Our memory from ${year}`;
        
        // Create caption element
        const caption = document.createElement('div');
        caption.className = 'photo-caption';
        caption.textContent = photo.caption;
        
        // Assemble elements
        imgContainer.appendChild(img);
        galleryItem.appendChild(imgContainer);
        galleryItem.appendChild(caption);
        
        galleryItem.addEventListener('click', ()=> {
            openModal(img.src, photo.caption, photo.note);
        });
        
        gallery.appendChild(galleryItem);
    });
}

    // Countdown timer (simplified)
    function updateCounter() {
        // This would normally calculate based on your anniversary date
        document.getElementById('years').textContent = '2';
        document.getElementById('months').textContent = '24';
        document.getElementById('days').textContent = '730';
    }
    
    updateCounter();
});