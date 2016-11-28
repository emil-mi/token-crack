import long from 'long';
import utf8 from 'utf8';

export function crackJWT(token) {
    let parts = token.split(".");
    if (parts.length !== 3) {
        return null;
    }

    let header = JSON.parse(atob(parts[0])), payload = JSON.parse(atob(parts[1])), signature = parts[2];
    return {header, payload, signature};
}

export function readUint(byteArray) {
    let result = 0;
    let shift = 0;
    let pos = 0;
    while(true) {
        let byte = byteArray[pos++];

        result += (byte & 0x7f) * Math.pow(2, shift);
        if ((byte & 0x80) === 0) {
            break;
        }
        shift += 7;
    }
    return [byteArray.slice(pos), result];
}

export function readInt(byteArray, length=4, signed=true) {
    let result = long.UZERO;
    let shift = 0;
    let pos = 0;
    let byte;

    while(length) {
        byte = byteArray[pos++];

        result = result.add( long.fromInt(byte & 0xff).shiftLeft(shift) );
        shift += 8;
        length--;
    }
    if (signed && (byte & 0x80)) {
        result = result.toSigned();
    }
    return [byteArray.slice(pos), result];
}

export function readBytes(io, len) {
    let strBytes = [...io.slice(0, len)];
    return [io.slice(len), strBytes];
}

export function readString(io) {
    let len;
    [io, len] = readUint(io);
    let strBytes = String.fromCharCode(...io.slice(0, len));
    return [io.slice(len), utf8.decode(strBytes)];
}

export function readByteFragment(io) {
    let len, bytes;
    [io, len] = readInt(io);
    [io, bytes]= readBytes(io, len);
    bytes.string = ()=> utf8.decode(String.fromCharCode(...bytes));
    return [io, bytes];
}
