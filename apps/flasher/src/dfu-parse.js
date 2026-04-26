/**
 * DfuSe memory descriptor parser.
 * Extracted for testability (vitest 4.x SSR bug with co-located exports).
 */
export function parseMemoryDescriptor(desc) {
    const nameEndIndex = desc.indexOf("/");
    if (!desc.startsWith("@") || nameEndIndex === -1) {
        throw new Error(`Not a DfuSe memory descriptor: "${desc}"`);
    }
    const name = desc.substring(1, nameEndIndex).trim();
    const segmentString = desc.substring(nameEndIndex);
    const segments = [];
    const sectorMultipliers = {
        " ": 1,
        B: 1,
        K: 1024,
        M: 1048576,
    };
    const contiguousSegmentRegex = /\/\s*(0x[0-9a-fA-F]{1,8})\s*\/(\s*[0-9]+\s*\*\s*[0-9]+\s?[ BKM]\s*[abcdefg]\s*,?\s*)+/g;
    let contiguousMatch;
    while ((contiguousMatch = contiguousSegmentRegex.exec(segmentString)) !== null) {
        const segmentRegex = /([0-9]+)\s*\*\s*([0-9]+)\s?([ BKM])\s*([abcdefg])\s*,?\s*/g;
        let startAddress = parseInt(contiguousMatch[1], 16);
        let segmentMatch;
        while ((segmentMatch = segmentRegex.exec(contiguousMatch[0])) !== null) {
            const sectorCount = parseInt(segmentMatch[1], 10);
            const sectorSize = parseInt(segmentMatch[2]) * sectorMultipliers[segmentMatch[3]];
            const properties = segmentMatch[4].charCodeAt(0) - "a".charCodeAt(0) + 1;
            segments.push({
                start: startAddress,
                sectorSize,
                end: startAddress + sectorSize * sectorCount,
                readable: (properties & 0x1) !== 0,
                erasable: (properties & 0x2) !== 0,
                writable: (properties & 0x4) !== 0,
            });
            startAddress += sectorSize * sectorCount;
        }
    }
    return { name, segments };
}
