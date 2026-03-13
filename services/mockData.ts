import { Grade, QualityLevel, RateCardItem, CategoryGroup } from '../types';

// Raw Rate Card Data provided in JSON format
// Unit: 'nghìn VNĐ' -> needs to be multiplied by 1000
const RAW_JSON_DATA = [
  {"id": "Tư vấn cho khách hàng > Gặp và tư vấn cho khách hàng", "p": [95, 135, 176, 126, 180, 234, 252, 360, 468, 700, 1000, 1300]},
  {"id": "Tư vấn cho khách hàng > Concept/Big Idea", "p": [95, 135, 176, 126, 180, 234, 252, 360, 468, 700, 1000, 1300]},
  {"id": "Tư vấn cho khách hàng > Slogan", "p": [71, 101, 131, 95, 135, 176, 189, 270, 351, 525, 750, 975]},
  {"id": "Tư vấn cho khách hàng > Content Direction", "p": [142, 203, 264, 189, 270, 351, 378, 540, 702, 1050, 1500, 1950]},
  {"id": "Tư vấn cho khách hàng > Content Angle", "p": [189, 270, 351, 252, 360, 468, 504, 720, 936, 1400, 2000, 2600]},
  {"id": "Tư vấn cho khách hàng > Outline", "p": [32, 45, 59, 42, 60.3, 78, 84, 120.6, 157, 235, 335, 436]},
  {"id": "Article > Tổ chức sản xuất nhãn chiến lược", "p": [307, 439, 571, 410, 585, 761, 819, 1170, 1521, 1229, 1755, 2282]},
  {"id": "Article > Biên tập bài cho khách hàng", "p": [118, 169, 220, 158, 225, 293, 315, 450, 585, 473, 675, 878]},
  {"id": "Article > Biên tập cho cw trong team, kênh", "p": [95, 135, 176, 126, 180, 234, 252, 360, 468, 378, 540, 702]},
  {"id": "Article > Viết thông cáo báo chí", "p": [237, 338, 439, 315, 450, 585, 630, 900, 1170, 945, 1350, 1755]},
  {"id": "Article > Bài dịch Việt - Anh", "p": [213, 304, 395, 284, 405, 527, 567, 810, 1053, 851, 1215, 1580]},
  {"id": "Article > Bài dịch Anh - Việt", "p": [189, 270, 351, 252, 360, 468, 504, 720, 936, 756, 1080, 1404]},
  {"id": "Article > Xử lí thông cáo báo chí", "p": [142, 203, 264, 189, 270, 351, 378, 540, 702, 567, 810, 1053]},
  {"id": "Article > Tin ngắn", "p": [165, 236, 307, 221, 315, 410, 441, 630, 819, 0, 0, 0]},
  {"id": "Article > Bài thông thường", "p": [189, 270, 351, 252, 360, 468, 350, 500, 650, 0, 0, 0]},
  {"id": "Article > Bài phân tích - nhận định", "p": [0, 0, 0, 280, 400, 520, 378, 540, 702, 567, 810, 1053]},
  {"id": "Article > Bài phân tích - nhận định chuyên sâu", "p": [0, 0, 0, 0, 0, 0, 560, 800, 1200, 630, 900, 1350]},
  {"id": "Article > Bài tường thuật nóng sự kiện đơn giản", "p": [189, 270, 351, 252, 360, 468, 504, 720, 936, 756, 1080, 1404]},
  {"id": "Article > Bài tường thuật nóng sự kiện phức tạp", "p": [284, 405, 527, 378, 540, 702, 756, 1080, 1404, 1134, 1620, 2106]},
  {"id": "Article > Bài review sản phẩm - nhanh", "p": [165, 236, 307, 221, 315, 410, 441, 630, 819, 662, 945, 1229]},
  {"id": "Article > Bài review sản phẩm - chuyên sâu", "p": [0, 0, 0, 0, 0, 0, 560, 800, 1200, 700, 1000, 1500]},
  {"id": "Article > Bài phỏng vấn - Thông thường", "p": [237, 338, 439, 315, 450, 585, 630, 900, 1170, 945, 1350, 1755]},
  {"id": "Article > Bài phỏng vấn - chuyên sâu", "p": [378, 540, 702, 504, 720, 936, 1008, 1440, 1872, 1512, 2160, 2808]},
  {"id": "Article > Q&A", "p": [237, 338, 439, 315, 450, 585, 630, 900, 1170, 945, 1350, 1755]},
  {"id": "Article > Bài viết SEO", "p": [105, 150, 195, 140, 200, 260, 175, 250, 325, 0, 0, 0]},
  {"id": "Article > Comparing / Before - After", "p": [189, 270, 351, 252, 360, 468, 504, 720, 936, 756, 1080, 1404]},
  {"id": "Visual > Photo story", "p": [189, 270, 351, 252, 360, 468, 504, 720, 936, 756, 1080, 1404]},
  {"id": "Visual > Photo Essay", "p": [189, 270, 351, 252, 360, 468, 504, 720, 936, 756, 1080, 1404]},
  {"id": "Visual > Photo Quote", "p": [237, 338, 439, 315, 450, 585, 630, 900, 1170, 945, 1350, 1755]},
  {"id": "Visual > Gif essay", "p": [237, 338, 439, 315, 450, 585, 630, 900, 1170, 945, 1350, 1755]},
  {"id": "Visual > Infographic", "p": [260, 371, 482, 347, 495, 644, 693, 990, 1287, 1040, 1485, 1931]},
  {"id": "Visual > Comic", "p": [284, 405, 527, 378, 540, 702, 756, 1080, 1404, 1134, 1620, 2106]},
  {"id": "Visual > Gif comic/Comic động", "p": [284, 405, 527, 378, 540, 702, 756, 1080, 1404, 1134, 1620, 2106]},
  {"id": "Visual > Sketch-note", "p": [260, 371, 482, 347, 495, 644, 693, 990, 1287, 1040, 1485, 1931]},
  {"id": "Visual > Bài review thời trang - công nghệ", "p": [189, 270, 351, 252, 360, 468, 504, 720, 936, 756, 1080, 1404]},
  {"id": "Visual > Bài review - test xe", "p": [473, 675, 878, 630, 900, 1170, 1260, 1800, 2340, 1890, 2700, 3510]},
  {"id": "Visual > Bài trang điểm", "p": [142, 203, 264, 189, 270, 351, 378, 540, 702, 567, 810, 1053]},
  {"id": "Visual > Tin & ảnh tường thuật Đại hội cổ đông", "p": [0, 0, 0, 0, 0, 0, 350, 500, 650, 525, 750, 975]},
  {"id": "Interactive > Quiz 0-5 câu", "p": [142, 203, 264, 189, 270, 351, 378, 540, 702, 567, 810, 1053]},
  {"id": "Interactive > Quiz 6-10 câu", "p": [237, 338, 439, 315, 450, 585, 630, 900, 1170, 945, 1350, 1755]},
  {"id": "Interactive > Interactive Infographic", "p": [1182, 1688, 2194, 1575, 2250, 2925, 3150, 4500, 5850, 4725, 6750, 8775]},
  {"id": "Long Form > eMagazine", "p": [0, 0, 0, 756, 1080, 1404, 1512, 2160, 2808, 2268, 3240, 4212]},
  {"id": "Long Form > mini Magazine Kenh14, AF, GameK, GenK", "p": [0, 0, 0, 350, 500, 650, 504, 720, 936, 756, 1080, 1404]},
  {"id": "Long Form > mini Magazine CafeF, CafeBiz, Soha, AutoPro", "p": [0, 0, 0, 420, 600, 780, 630, 900, 1170, 945, 1350, 1755]},
  {"id": "Post social thường > Post social thường", "p": [13, 18, 23, 16, 23.4, 30, 33, 46.8, 61, 49, 70.2, 91]},
  {"id": "Activity > Minigame", "p": [106, 152, 198, 142, 202.5, 263, 284, 405, 527, 425, 607.5, 790]},
  {"id": "Activity > Contest", "p": [177, 253, 329, 236, 337.5, 439, 473, 675, 878, 709, 1012.5, 1316]},
  {"id": "Post viral > Caption KOLs/ Hot influencer (1 người)", "p": [12, 17, 22, 16, 22.5, 29, 32, 45, 59, 47, 67.5, 88]},
  {"id": "Post viral > Caption Micro Influencer (1 người)", "p": [12, 17, 22, 16, 22.5, 29, 32, 45, 59, 47, 67.5, 88]},
  {"id": "Post viral > Post nội dung fanpage nội bộ (Kênh 14, Afamily,...)", "p": [10, 14, 18, 13, 18, 23, 25, 36, 47, 38, 54, 70]},
  {"id": "Post viral > Post nội dung seeding trên fanpage ngoài", "p": [12, 17, 22, 16, 22.5, 29, 32, 45, 59, 47, 67.5, 88]},
  {"id": "Post viral > Caption share bài PR", "p": [12, 17, 22, 16, 22.5, 29, 32, 45, 59, 47, 67.5, 88]},
  {"id": "Pitching > Lên content direction", "p": [142, 203, 264, 189, 270, 351, 378, 540, 702, 567, 810, 1053]},
  {"id": "Pitching > Calendar tháng (Angles tháng)", "p": [142, 203, 264, 189, 270, 351, 378, 540, 702, 567, 810, 1053]},
  {"id": "Pitching > Hỗ trợ acc tổng làm plan", "p": [142, 203, 264, 189, 270, 351, 378, 540, 702, 567, 810, 1053]},
  {"id": "Pitching > Tagline, slogan", "p": [284, 405, 527, 378, 540, 702, 756, 1080, 1404, 1134, 1620, 2106]},
  {"id": "Pitching > Key message", "p": [189, 270, 351, 252, 360, 468, 504, 720, 936, 756, 1080, 1404]},
  {"id": "Pitching > Viết demo post", "p": [13, 18, 23, 16, 23.4, 30, 33, 46.8, 61, 49, 70.2, 91]},
  {"id": "Kịch bản Video > Kịch bản Video Viral", "p": [142, 203, 264, 189, 270, 351, 378, 540, 702, 567, 810, 1053]},
  {"id": "Kịch bản Video > Kịch bản Mutex Đơn giản", "p": [24, 34, 44, 32, 45, 59, 63, 90, 117, 95, 135, 176]},
  {"id": "Kịch bản Video > Kịch bản phỏng vấn dạo", "p": [118, 169, 220, 158, 225, 293, 315, 450, 585, 473, 675, 878]},
  {"id": "Kịch bản Video > Kịch bản Welax video", "p": [118, 169, 220, 158, 225, 293, 315, 450, 585, 473, 675, 878]},
  {"id": "Kịch bản Video > Kịch bản Livestream", "p": [189, 270, 351, 252, 360, 468, 504, 720, 936, 756, 1080, 1404]},
  {"id": "Kịch bản Video > Kịch bản quay Vlog (8-15ph)", "p": [48, 68, 88, 63, 90, 117, 126, 180, 234, 189, 270, 351]},
  {"id": "Kịch bản Video > Chụp/ quay Review bằng điện thoại", "p": [95, 135, 176, 126, 180, 234, 252, 360, 468, 378, 540, 702]},
  {"id": "Chụp ảnh > Concept chụp ảnh", "p": [43, 61, 79, 57, 81, 105, 113, 162, 211, 170, 243, 316]},
  {"id": "Kịch bản Podcast > Biên tập ND có sẵn Story Podcast", "p": [183.75, 262.5, 341.25, 245, 350, 455, 490, 700, 910, 735, 1050, 1365]},
  {"id": "Kịch bản Podcast > Sản xuất mới Story Podcast", "p": [315, 450, 585, 420, 600, 780, 840, 1200, 1560, 1260, 1800, 2340]},
  {"id": "Kịch bản Podcast > Interview Podcast", "p": [420, 600, 780, 560, 800, 1040, 1120, 1600, 2080, 1680, 2400, 3120]},
  {"id": "Kịch bản Podcast > Expert Podcast", "p": [472.5, 675, 877.5, 630, 900, 1170, 1260, 1800, 2340, 1890, 2700, 3510]},
  {"id": "Phát triển nội dung web > Landing page", "p": [142, 203, 264, 189, 270, 351, 378, 540, 702, 567, 810, 1053]},
  {"id": "Phát triển nội dung web > Microsite", "p": [189, 270, 351, 252, 360, 468, 504, 720, 936, 756, 1080, 1404]},
  {"id": "Phát triển nội dung web > Website", "p": [709, 1013, 1317, 945, 1350, 1755, 1890, 2700, 3510, 2835, 4050, 5265]},
  {"id": "Content IMC > Email Marketing", "p": [142, 203, 264, 189, 270, 351, 378, 540, 702, 567, 810, 1053]},
  {"id": "Content IMC > Tờ rơi, poster", "p": [331, 473, 615, 441, 630, 819, 882, 1260, 1638, 1323, 1890, 2457]},
  {"id": "Content IMC > Brochue", "p": [473, 675, 878, 630, 900, 1170, 1260, 1800, 2340, 1890, 2700, 3510]},
  {"id": "Content IMC > Lịch", "p": [237, 338, 439, 315, 450, 585, 630, 900, 1170, 945, 1350, 1755]},
  {"id": "Content Joy > Viết post", "p": [33, 47, 61, 44, 63, 82, 88, 126, 164, 132, 189, 246]},
  {"id": "Content Joy > Edit post", "p": [14, 20, 26, 19, 27, 35, 38, 54, 70, 57, 81, 105]},
  {"id": "Livestream Content Talk - Kịch bản 40", "p": [213, 304, 395, 284, 405, 527, 567, 810, 1053, 851, 1215, 1580]},
  {"id": "Livestream Content Talk - Biên tập hình ảnh/ clip 20", "p": [132, 189, 246, 176, 252, 328, 353, 504, 655, 529, 756, 983]},
  {"id": "Livestream Content Talk - Kết nối khách mời 10", "p": [71, 101, 131, 95, 135, 176, 189, 270, 351, 284, 405, 527]},
  {"id": "Livestream Content Talk - Đạo diễn 30", "p": [95, 135, 176, 126, 180, 234, 252, 360, 468, 378, 540, 702]},
  {"id": "Viết thiệp > Viết thiệp sinh nhật, thiệp chúc mừng", "p": [10, 14, 18, 13, 18, 23, 0, 0, 0, 0, 0, 0]},
  {"id": "Viết thiệp > Viết thiệp cho khách hàng", "p": [19, 27, 35, 25, 36, 47, 50, 72, 94, 0, 0, 0]},
  {"id": "Tài liệu/ Ấn phẩm nội bộ > Viết bài", "p": [284, 405, 527, 378, 540, 702, 756, 1080, 1404, 1134, 1620, 2106]},
  {"id": "Tài liệu/ Ấn phẩm nội bộ > Dịch bài", "p": [262.96, 375, 487.96, 350, 500, 650, 700, 1000, 1300, 1050, 1500, 1950]},
  {"id": "Tài liệu/ Ấn phẩm nội bộ > Biên tập", "p": [48, 68, 88, 63, 90, 117, 126, 180, 234, 189, 270, 351]},
  {"id": "Tài liệu/ Ấn phẩm nội bộ > Kiểm duyệt", "p": [71, 101, 131, 95, 135, 176, 189, 270, 351, 284, 405, 527]},
  {"id": "Tài liệu/ Ấn phẩm nội bộ > Casestudy", "p": [378, 540, 702, 504, 720, 936, 1008, 1440, 1872, 1512, 2160, 2808]},
  {"id": "Tài liệu/ Ấn phẩm nội bộ > Landing page", "p": [100, 142, 185, 132, 189, 246, 265, 378, 491, 397, 567, 737]},
  {"id": "Tài liệu/ Ấn phẩm nội bộ > Microsite", "p": [132, 189, 246, 176, 252, 328, 353, 504, 655, 529, 756, 983]},
  {"id": "Tài liệu/ Ấn phẩm nội bộ > Website", "p": [496, 709, 922, 662, 945, 1229, 1323, 1890, 2457, 1985, 2835, 3686]},
  {"id": "Tư vấn nội bộ > Concept/Big Idea", "p": [71, 101, 131, 95, 135, 176, 189, 270, 351, 284, 405, 527]},
  {"id": "Tư vấn nội bộ > Email Marketing", "p": [48, 68, 88, 63, 90, 117, 126, 180, 234, 189, 270, 351]},
  {"id": "Tư vấn nội bộ > Kịch bản Video", "p": [95, 135, 176, 126, 180, 234, 252, 360, 468, 378, 540, 702]},
  {"id": "Tư vấn nội bộ > Định hướng nội dung", "p": [132, 189, 246, 176, 252, 328, 353, 504, 655, 980, 1400, 1820]}
];

// Helper to parse Category and Name from ID string
const parseId = (id: string) => {
    let category = '';
    let name = '';
    
    // Check for " > " separator first (most common)
    if (id.includes(' > ')) {
        const parts = id.split(' > ');
        category = parts[0].trim();
        name = parts[1].trim();
    } 
    // Check for " - " separator (e.g., Livestream items)
    else if (id.includes(' - ')) {
        const parts = id.split(' - ');
        category = parts[0].trim();
        name = parts[1].trim();
    } 
    // Fallback if no separator found
    else {
        category = 'Khác';
        name = id;
    }
    return { category, name };
}

// Map the 12-element array to the RateCardItem prices structure
// Multiplies values by 1000 as per requirement (Unit: nghìn VNĐ)
const mapPrices = (p: number[]) => ({
    [QualityLevel.Simple]: {
        [Grade.C]: p[0] * 1000,
        [Grade.B]: p[1] * 1000,
        [Grade.A]: p[2] * 1000,
    },
    [QualityLevel.Standard]: {
        [Grade.C]: p[3] * 1000,
        [Grade.B]: p[4] * 1000,
        [Grade.A]: p[5] * 1000,
    },
    [QualityLevel.HighQuality]: {
        [Grade.C]: p[6] * 1000,
        [Grade.B]: p[7] * 1000,
        [Grade.A]: p[8] * 1000,
    },
    [QualityLevel.Special]: {
        [Grade.C]: p[9] * 1000,
        [Grade.B]: p[10] * 1000,
        [Grade.A]: p[11] * 1000,
    },
});

const groupedData: Record<string, RateCardItem[]> = {};

RAW_JSON_DATA.forEach((item, index) => {
  const { category, name } = parseId(item.id);
  
  if (!groupedData[category]) {
    groupedData[category] = [];
  }
  
  groupedData[category].push({
      id: `${index + 1}`,
      name: name,
      category: category,
      prices: mapPrices(item.p),
      unit: 'Bài' // Default unit
  });
});

export const CATEGORIES: CategoryGroup[] = Object.keys(groupedData).map(catName => ({
  name: catName,
  items: groupedData[catName]
}));

export const ALL_ITEMS = Object.values(groupedData).flat();
