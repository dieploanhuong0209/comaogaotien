import { Grade, QualityLevel, RateCardItem, LineItem } from '../types';

// Synonym map for fuzzy matching common user inputs to official Format Names/IDs
const SYNONYMS: Record<string, string> = {
    'bài pr': 'Article > Bài thông thường',
    'pr': 'Article > Bài thông thường',
    'bài viết': 'Article > Bài thông thường',
    'tiktok': 'Kịch bản Video > Kịch bản Mutex Đơn giản',
    'kịch bản tiktok': 'Kịch bản Video > Kịch bản Mutex Đơn giản',
    'mutex': 'Kịch bản Video > Kịch bản Mutex Đơn giản',
    'post social': 'Post social thường > Post social thường',
    'social': 'Post social thường > Post social thường',
    'facebook': 'Post social thường > Post social thường',
    'fanpage': 'Post social thường > Post social thường',
    'expert podcast': 'Kịch bản Podcast > Expert Podcast',
    'podcast expert': 'Kịch bản Podcast > Expert Podcast',
    'livestream': 'Kịch bản Video > Kịch bản Livestream',
    'kịch bản livestream': 'Kịch bản Video > Kịch bản Livestream',
    'review': 'Article > Bài review sản phẩm - nhanh', // Default quick review
    'review nhanh': 'Article > Bài review sản phẩm - nhanh',
    'review sâu': 'Article > Bài review sản phẩm - chuyên sâu',
    'clip': 'Kịch bản Video > Kịch bản Video Viral',
    'video': 'Kịch bản Video > Kịch bản Video Viral',
};

export const parseBulkInput = (text: string, allItems: RateCardItem[]): LineItem[] => {
    const lines = text.split(/\n+/).filter(l => l.trim().length > 0);
    const parsedRaw: any[] = [];

    lines.forEach(line => {
        // Skip common trash lines (dates, pure numbers, headers)
        if (line.match(/^\d+\.?$/) || line.match(/^\d{1,2}\/\d{1,2}/) || line.match(/^stt$/i)) return;

        const lowerLine = line.toLowerCase();
        
        // 1. Quantity Extraction
        // Default: 1
        let quantity = 1;
        // Patterns: "2 bài", "sl: 2", "x2", "- 2"
        const qtyMatch = line.match(/(\d+)\s*(?:bài|cái|post|video|kb|kịch bản|số|chiếc|shot|job)|sl\s*[:.]?\s*(\d+)|x\s*(\d+)|^\s*-\s*(\d+)|^\s*(\d+)\s*[-.]/i);
        if (qtyMatch) {
            // Find the first capturing group that is defined
            const num = qtyMatch.slice(1).find(m => m !== undefined);
            if (num) quantity = parseFloat(num);
        }

        // 2. Grade Extraction
        // Default: Grade A (Assumption for automation if not specified, usually standard is high)
        let grade = Grade.A; 
        
        // Explicit checks
        if (line.match(/(?:hạng|grade|loại|rank)\s*([abc])/i)) {
            const m = line.match(/(?:hạng|grade|loại|rank)\s*([abc])/i);
            if (m && m[1]) grade = m[1].toUpperCase() as Grade;
        } else {
            // Implicit checks (A), (B), (C) or specific keywords
            if (line.match(/\b(hang a|loai a)\b/i) || line.includes('(A)') || line.includes('(a)')) grade = Grade.A;
            else if (line.match(/\b(hang b|loai b)\b/i) || line.includes('(B)') || line.includes('(b)')) grade = Grade.B;
            else if (line.match(/\b(hang c|loai c)\b/i) || line.includes('(C)') || line.includes('(c)')) grade = Grade.C;
        }

        // 3. Quality Level Extraction
        // Default: Standard
        let quality = QualityLevel.Standard;
        if (line.match(/simple|đơn giản/i)) quality = QualityLevel.Simple;
        else if (line.match(/high quality|clc|cao cấp/i)) quality = QualityLevel.HighQuality;
        else if (line.match(/special|đặc biệt/i)) quality = QualityLevel.Special;
        // Standard is default, so no regex needed for it specifically if others don't match

        // 4. Format Mapping (Find best matching ID)
        let matchedItem: RateCardItem | undefined;
        
        // Strategy A: Check Synonyms first
        for (const [key, targetId] of Object.entries(SYNONYMS)) {
            if (lowerLine.includes(key)) {
                matchedItem = allItems.find(i => i.id === targetId);
                if (matchedItem) break;
            }
        }

        // Strategy B: Exact Name inclusion (prioritize longer names to avoid partial matches of shorter names)
        if (!matchedItem) {
            const sortedItems = [...allItems].sort((a, b) => b.name.length - a.name.length);
            matchedItem = sortedItems.find(item => lowerLine.includes(item.name.toLowerCase()));
        }

        // Strategy C: Category + Name Fuzzy Match (fallback)
        if (!matchedItem) {
             matchedItem = allItems.find(item => 
                lowerLine.includes(item.category.toLowerCase()) && 
                lowerLine.includes(item.name.toLowerCase())
            );
        }

        if (matchedItem) {
            // Calculate price
             const price = matchedItem.prices[quality]?.[grade] || 
                      matchedItem.prices[QualityLevel.Standard]?.[Grade.A] || 0;

            parsedRaw.push({
                rateCardId: matchedItem.id,
                inputName: line.trim(),
                name: matchedItem.name,
                category: matchedItem.category,
                quality,
                grade,
                quantity,
                percentage: 100, // Default 100%
                isOT: false,     // Default No OT
                unitPrice: price,
                total: price * quantity
            });
        }
    });

    // 5. Aggregation
    const aggregatedMap = new Map<string, LineItem>();
    
    parsedRaw.forEach(p => {
        // Group Key: Same ID + Same Quality + Same Grade + Same Percentage + Same OT
        // (Note: Usually bulk input assumes standard, so this works fine. 
        // If users want different percentages for same type, they shouldn't aggregate, but current logic aggregates identical configs)
        const key = `${p.rateCardId}-${p.quality}-${p.grade}-${p.percentage}-${p.isOT}`;
        
        if (aggregatedMap.has(key)) {
            const existing = aggregatedMap.get(key)!;
            existing.quantity += p.quantity;
            existing.total = existing.quantity * existing.unitPrice; // Recalculate total logic inside App handles OT/%, here simplified for bulk
            
            // Update inputName to indicate aggregation if not already done
            if (!existing.inputName.includes('(Gộp)')) {
                 existing.inputName = `${existing.name} (Gộp)`;
            }
        } else {
             aggregatedMap.set(key, {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                ...p
             });
        }
    });

    return Array.from(aggregatedMap.values());
};