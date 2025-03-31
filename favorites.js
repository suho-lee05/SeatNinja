console.log("📌 favorites.js 로드됨!");

// ✅ 고정된 즐겨찾기 좌석 리스트
const favoriteSeats = [376, 377, 378, 379, 380, 381, 382, 383, 384]; // 🎯 원하는 좌석을 여기에 설정

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

    //alert(`🎯 좌석 ${seatId} 예약을 시도합니다.`); // ✅ 예약 시작 알림

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

            //alert(`✅ 좌석 ${seatId} 예약 성공! 배석 확정 진행 중...`); // ✅ 예약 성공 알림

            // ✅ 예약 성공 후 배석 확정 실행
            await confirmSeat(reservationId);
        } else {
            console.log(`❌ 예약 실패: ${reserveData.message}`);
            alert(`❌ 예약 실패: ${reserveData.message}`); // ✅ 예약 실패 알림
        }
    } catch (error) {
        console.error("❌ 예약 오류 발생!", error);
        alert("❌ 예약 오류 발생!"); // ✅ 오류 알림
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
            alert(`✅ 좌석 ${reservationId} 배석 확정 완료!`); // ✅ 배석 확정 성공 알림
        } else {
            console.log(`❌ 배석 확정 실패: ${data.message}`);
            alert(`❌ 배석 확정 실패: ${data.message}`); // ✅ 배석 확정 실패 알림
        }
    } catch (error) {
        console.error("❌ 배석 확정 오류 발생!", error);
        alert("❌ 배석 확정 오류 발생!"); // ✅ 배석 확정 오류 알림
    }
}

// ✅ 페이지가 로드될 때 즐겨찾기 좌석을 표시
document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 DOMContentLoaded 이벤트 감지됨!");
    showFavoriteSeats();
});
