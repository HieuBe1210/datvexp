import json
from datetime import datetime, timedelta
import random

# Dữ liệu độ dài phim từ movie_id 50 đến 60
movies = {
    50: 112,  # Vây Hãm Tại Đài Bắc
    51: 119,  # Vùng Đất Bị Nguyền Rủa
    52: 124,  # Robot Hoang Dã
    53: 146,  # Tiên Tri Tử Thần
    54: 96,   # Tiếng Gọi Của Oán Hồn
    55: 107,  # Trò Chơi Nhân Tính
    56: 97,   # Ác Quỷ Truy Hồn
    57: 123,  # Nobita và Cuộc Phiêu Lưu Vào Thế Giới Trong Tranh
    58: 122,  # Quỷ Nhập Tràng
    59: 80,   # Emma Và Vương Quốc Tí Hon
    60: 98    # Vietnamese Concert Film: Chúng Ta Là Người Việt Nam
}

# Khởi tạo danh sách các rạp từ cinema_01 đến cinema_20
cinemas = [f"cinema_0{i}" if i < 10 else f"cinema_{i}" for i in range(1, 21)]

# Hàm tạo khung giờ ngẫu nhiên cho từng rạp
def generate_random_showtimes(cinema_id):
    showtimes = set()
    num_showtimes = random.randint(2, 4)
    while len(showtimes) < num_showtimes:
        hour = random.randint(9, 22)
        minute = random.choice([0, 15, 30, 45])
        showtime = f"{hour:02d}:{minute:02d}"
        showtimes.add(showtime)
    return sorted(list(showtimes))

# Tính thời gian kết thúc dựa trên độ dài phim
def calculate_end_time(start_time, movie_id):
    start = datetime.strptime(start_time, "%H:%M")
    duration = movies.get(movie_id, 120)  # Mặc định 120 phút nếu không tìm thấy movie_id
    total_minutes = start.hour * 60 + start.minute + duration
    end_hour = (total_minutes // 60) % 24
    end_minute = total_minutes % 60
    return f"{end_hour:02d}:{end_minute:02d}"

# Hàm tạo danh sách ghế "sold"
def generate_sold_seats():
    rows = ["a", "b", "c", "d", "e", "f", "g", "h"]
    seats = {}
    seat_keys = [f"{row}{i}" for row in rows for i in range(1, 11)]
    seats_to_book = random.randint(2, 4)
    sold_seats = random.sample(seat_keys, seats_to_book)
    for seat in sold_seats:
        seats[seat] = {"status": "sold"}
    return seats

# Tạo dữ liệu showtimes
showtimes_data = {"Showtimes": {}}
start_date = datetime(2025, 4, 1)
days = [start_date + timedelta(days=i) for i in range(4)]

for day in days:
    date = day.strftime("%Y-%m-%d")
    cinema_showtimes = {cinema: generate_random_showtimes(cinema) for cinema in cinemas}
    
    for cinema in cinemas:
        room = "Room 1"
        available_movies = random.sample(list(movies.keys()), k=random.randint(7, len(movies)))
        showtimes_hours = cinema_showtimes[cinema]
        print(f"Rạp {cinema} ngày {date} chiếu phim {available_movies} vào các giờ: {showtimes_hours}")

        for movie in available_movies:
            for start_hour in showtimes_hours:
                showtime_key = f"showtime_{date.replace('-', '')}_{start_hour.replace(':', '')}_{cinema}_movie{movie}"
                end_hour = calculate_end_time(start_hour, movie)

                showtime_info = {
                    "cinema_id": cinema,
                    "room": room,
                    "movie_id": movie,
                    "start_time": f"{date} {start_hour}",
                    "end_time": f"{date} {end_hour}"
                }
                showtimes_data["Showtimes"][showtime_key] = showtime_info

# Tạo dữ liệu bookings
bookings_data = {"Bookings": {}}
for showtime_key in showtimes_data["Showtimes"].keys():
    seats = generate_sold_seats()
    bookings_data["Bookings"][showtime_key] = {"seats": seats}

# Ghi dữ liệu vào file JSON
with open('showtimes_3days.json', 'w', encoding='utf-8') as file:
    json.dump(showtimes_data, file, ensure_ascii=False, indent=4)

with open('bookings_3days_sold_only.json', 'w', encoding='utf-8') as file:
    json.dump(bookings_data, file, ensure_ascii=False, indent=4)

print("File JSON 'showtimes_3days.json' và 'bookings_3days_sold_only.json' đã được tạo thành công!")