// ✅ 즐겨찾기 페이지로 이동
function goToFavorites() {
    window.location.href = "favorites.html";
}


console.log("📌 favorites.js 로드됨!");

// ✅ 고정된 즐겨찾기 좌석 리스트
const favoriteSeats = [10, 15, 22, 35, 47]; // 🎯 원하는 좌석을 여기에 설정

// ✅ 즐겨찾기 좌석 UI 생성
function showFavoriteSeats() {
    console.log("📌 showFavoriteSeats() 실행됨!");

    let container = document.getElementById("favoritesContainer");

    if (!container) {
        console.error("📛 Error: favoritesContainer 요소를 찾을 수 없습니다!");
        return;
    }

    container.innerHTML = ""; // 기존 내용 초기화

    if (favoriteSeats.length === 0) {
        container.innerHTML = "<p>❌ 등록된 즐겨찾기 좌석이 없습니다.</p>";
        return;
    }

    favoriteSeats.forEach(seat => {
        let btn = document.createElement("button");
        btn.innerText = `좌석 ${seat} 예약`;
        btn.className = "btn btn-primary";
        btn.onclick = () => reserveFavoriteSeat(seat); // 클릭 시 해당 좌석 예약 실행
        container.appendChild(btn);
    });

    console.log("✅ 좌석 버튼 생성 완료!");
}

// ✅ 특정 좌석 예약
async function reserveFavoriteSeat(seatId) {
    console.log(`🎯 좌석 ${seatId} 예약 시도 중...`);

    document.getElementById("favoritesContainer").innerHTML = `🎯 좌석 ${seatId} 예약 중...`;

    try {
        let response = await fetch("https://library.konkuk.ac.kr/pyxis-api/1/api/seat-charges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "pyxis-auth-token": localStorage.getItem("USER_TOKEN") // ✅ 로그인 토큰 사용
            },
            body: JSON.stringify({ seatId: seatId, smufMethodCode: "MOBILE" })
        });

        let reserveData = await response.json();

        if (reserveData.success) {
            let reservationId = reserveData.data.id;  // ✅ 예약 ID 저장
            console.log(`✅ 좌석 ${seatId} 예약 성공! 배석 확정 진행 중...`);
            document.getElementById("favoritesContainer").innerHTML = `✅ 좌석 ${seatId} 예약 성공! 배석 확정 중...`;

            // ✅ 예약 성공 후 배석 확정 실행
            await confirmSeat(reservationId);
        } else {
            document.getElementById("favoritesContainer").innerHTML = `❌ 예약 실패: ${reserveData.message}`;
        }
    } catch (error) {
        document.getElementById("favoritesContainer").innerHTML = "❌ 예약 오류 발생!";
    }
}

// ✅ 배석 확정 기능 추가
async function confirmSeat(reservationId) {
    try {
        let response = await fetch(`https://library.konkuk.ac.kr/pyxis-api/1/api/seat-charges/${reservationId}?smufMethodCode=MOBILE&_method=put`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "pyxis-auth-token": localStorage.getItem("USER_TOKEN")
            }
        });

        let data = await response.json();

        if (data.success) {
            console.log(`✅ 좌석 ${reservationId} 배석 확정 완료!`);
            document.getElementById("favoritesContainer").innerHTML = `✅ 좌석 ${reservationId} 배석 확정 완료!`;
        } else {
            console.log(`❌ 배석 확정 실패: ${data.message}`);
            document.getElementById("favoritesContainer").innerHTML = `❌ 배석 확정 실패: ${data.message}`;
        }
    } catch (error) {
        document.getElementById("favoritesContainer").innerHTML = "❌ 배석 확정 오류 발생!";
    }
}


// ✅ 페이지가 로드될 때 즐겨찾기 좌석을 표시
document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 DOMContentLoaded 이벤트 감지됨!");
    showFavoriteSeats();
});
