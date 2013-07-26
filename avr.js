"use strict";

/**
 * 8-bit AVR Instruction set written in Javascript
 * by Andor Polgar (hngrhorace) 2013
 * 
 * 
 * 
 * Nomenclature
 * 
 * Status register (SREG)
 * SREG: Status register
 * C:    Carry Flag
 * Z:    Zero Flag
 * N:    Negative Flag
 * V:    Two's complement overflow indicator
 * S:    N ^ V, For signed tests
 * H:    Half Carry Flag
 * T:    Transfer bit used by BLD and BST instructions
 * I:    Global Interrupt Enable/Disable Flag
 * 
 * Registers and Operands
 * Rd:      Destination (and source) register in the Register File
 * Rr:      Source register
 * R:       Result after instruction is executed
 * K:       Constant data
 * k:       Constant address
 * b:       Bit in the Register File or I/O Register (3-bit)
 * s:       Bit in the Status Register (3-bit)
 * X, Y, Z: Indirect Address Register
 * A:       I/O location address
 * q:       Displacement for direct addressing (6-bit)
 * 
 */
var avr = {
	/** Program counter */
	PC: 0,
	/** SPH - Stack Pointer Low */
	spl: 0x5d,
	/** SPH - Stack Pointer High */
	sph: 0x5e,
	/**
	 *  SREG - Status Register
	 *     0       1       2       3       4       5       6       7
	 * .-------.-------.-------.-------.-------.-------.-------.-------.
	 * |   C   |   Z   |   N   |   V   |   S   |   H   |   T   |   I   |
	 * '-------'-------'-------'-------'-------'-------'-------'-------'
	 *  C - Carry flag
	 *  Z - Zero flag
	 *  N - Negative Flag
	 *  V - Two's Complement Overflow Flag
	 *  S - Sign Bit
	 *  H - Half Carry Flag 
	 *  T - Bit Copy Storage
	 *  I - Global interrupt enable 
	 */
	sreg: 0x5f,
	/*
	 * Data Space 
	 *
	 *     0       1       2       3       4       5       6       7
	 * .-------.-------.-------.-------.-------.-------.-------.-------.
	 * |  LSB  |       |       |       |       |       |       |  MSB  |
	 * '-------'-------'-------'-------'-------'-------'-------'-------'
	 */
	dataspace: {
		/**
		 * Register Space    0x00 - 0xFF
		 */
		
		/*
		 * General Purpose Register File    0x00 - 0x1f
		 *      MSB                                              LSB           */
		0x00: [false, false, false, false, false, false, false, false], /* R0  */
		0x01: [false, false, false, false, false, false, false, false], /* R1  */
		0x02: [false, false, false, false, false, false, false, false], /* R2  */
		0x03: [false, false, false, false, false, false, false, false], /* R3  */
		0x04: [false, false, false, false, false, false, false, false], /* R4  */
		0x05: [false, false, false, false, false, false, false, false], /* R5  */
		0x06: [false, false, false, false, false, false, false, false], /* R6  */
		0x07: [false, false, false, false, false, false, false, false], /* R7  */
		0x08: [false, false, false, false, false, false, false, false], /* R8  */
		0x09: [false, false, false, false, false, false, false, false], /* R9  */
		0x0a: [false, false, false, false, false, false, false, false], /* R10 */
		0x0b: [false, false, false, false, false, false, false, false], /* R11 */
		0x0c: [false, false, false, false, false, false, false, false], /* R12 */
		0x0d: [false, false, false, false, false, false, false, false], /* R13 */
		0x0e: [false, false, false, false, false, false, false, false], /* R14 */
		0x0f: [false, false, false, false, false, false, false, false], /* R15 */

		0x10: [false, false, false, false, false, false, false, false], /* R16 */
		0x11: [false, false, false, false, false, false, false, false], /* R17 */
		0x12: [false, false, false, false, false, false, false, false], /* R18 */
		0x13: [false, false, false, false, false, false, false, false], /* R19 */
		0x14: [false, false, false, false, false, false, false, false], /* R20 */
		0x15: [false, false, false, false, false, false, false, false], /* R21 */
		0x16: [false, false, false, false, false, false, false, false], /* R22 */
		0x17: [false, false, false, false, false, false, false, false], /* R23 */
		0x18: [false, false, false, false, false, false, false, false], /* R24 */
		0x19: [false, false, false, false, false, false, false, false], /* R25 */
		0x1a: [false, false, false, false, false, false, false, false], /* R26    X-register Low Byte */
		0x1b: [false, false, false, false, false, false, false, false], /* R27    X-register High Byte */
		0x1c: [false, false, false, false, false, false, false, false], /* R28    Y-register Low Byte */
		0x1d: [false, false, false, false, false, false, false, false], /* R29    Y-register High Byte */
		0x1e: [false, false, false, false, false, false, false, false], /* R30    Z-register Low Byte */
		0x1f: [false, false, false, false, false, false, false, false], /* R31    Z-register High Byte */

		0x20: [false, false, false, false, false, false, false, false],
		0x21: [false, false, false, false, false, false, false, false],
		0x22: [false, false, false, false, false, false, false, false],
		0x23: [false, false, false, false, false, false, false, false],
		0x24: [false, false, false, false, false, false, false, false],
		0x25: [false, false, false, false, false, false, false, false],
		0x26: [false, false, false, false, false, false, false, false],
		0x27: [false, false, false, false, false, false, false, false],
		0x28: [false, false, false, false, false, false, false, false],
		0x29: [false, false, false, false, false, false, false, false],
		0x2a: [false, false, false, false, false, false, false, false],
		0x2b: [false, false, false, false, false, false, false, false],
		0x2c: [false, false, false, false, false, false, false, false],
		0x2d: [false, false, false, false, false, false, false, false],
		0x2e: [false, false, false, false, false, false, false, false],
		0x2f: [false, false, false, false, false, false, false, false],
		0x30: [false, false, false, false, false, false, false, false],
		0x31: [false, false, false, false, false, false, false, false],
		0x32: [false, false, false, false, false, false, false, false],
		0x33: [false, false, false, false, false, false, false, false],
		0x34: [false, false, false, false, false, false, false, false],
		0x35: [false, false, false, false, false, false, false, false],
		0x36: [false, false, false, false, false, false, false, false],
		0x37: [false, false, false, false, false, false, false, false],
		0x38: [false, false, false, false, false, false, false, false],
		0x39: [false, false, false, false, false, false, false, false],
		0x3a: [false, false, false, false, false, false, false, false],
		0x3b: [false, false, false, false, false, false, false, false],
		0x3c: [false, false, false, false, false, false, false, false],
		0x3d: [false, false, false, false, false, false, false, false],
		0x3e: [false, false, false, false, false, false, false, false],
		0x3f: [false, false, false, false, false, false, false, false],
		0x40: [false, false, false, false, false, false, false, false],
		0x41: [false, false, false, false, false, false, false, false],
		0x42: [false, false, false, false, false, false, false, false],
		0x43: [false, false, false, false, false, false, false, false],
		0x44: [false, false, false, false, false, false, false, false],
		0x45: [false, false, false, false, false, false, false, false],
		0x46: [false, false, false, false, false, false, false, false],
		0x47: [false, false, false, false, false, false, false, false],
		0x48: [false, false, false, false, false, false, false, false],
		0x49: [false, false, false, false, false, false, false, false],
		0x4a: [false, false, false, false, false, false, false, false],
		0x4b: [false, false, false, false, false, false, false, false],
		0x4c: [false, false, false, false, false, false, false, false],
		0x4d: [false, false, false, false, false, false, false, false],
		0x4e: [false, false, false, false, false, false, false, false],
		0x4f: [false, false, false, false, false, false, false, false],
		0x50: [false, false, false, false, false, false, false, false],
		0x51: [false, false, false, false, false, false, false, false],
		0x52: [false, false, false, false, false, false, false, false],
		0x53: [false, false, false, false, false, false, false, false],
		0x54: [false, false, false, false, false, false, false, false],
		0x55: [false, false, false, false, false, false, false, false],
		0x56: [false, false, false, false, false, false, false, false],
		0x57: [false, false, false, false, false, false, false, false],
		0x58: [false, false, false, false, false, false, false, false],
		0x59: [false, false, false, false, false, false, false, false],
		0x5a: [false, false, false, false, false, false, false, false],
		0x5b: [false, false, false, false, false, false, false, false],
		0x5c: [false, false, false, false, false, false, false, false],
		0x5d: [false, false, false, false, false, false, false, false],
		0x5e: [false, false, false, false, false, false, false, false],
		0x5f: [false, false, false, false, false, false, false, false],
		0x60: [false, false, false, false, false, false, false, false],
		0x61: [false, false, false, false, false, false, false, false],
		0x62: [false, false, false, false, false, false, false, false],
		0x63: [false, false, false, false, false, false, false, false],
		0x64: [false, false, false, false, false, false, false, false],
		0x65: [false, false, false, false, false, false, false, false],
		0x66: [false, false, false, false, false, false, false, false],
		0x67: [false, false, false, false, false, false, false, false],
		0x68: [false, false, false, false, false, false, false, false],
		0x69: [false, false, false, false, false, false, false, false],
		0x6a: [false, false, false, false, false, false, false, false],
		0x6b: [false, false, false, false, false, false, false, false],
		0x6c: [false, false, false, false, false, false, false, false],
		0x6d: [false, false, false, false, false, false, false, false],
		0x6e: [false, false, false, false, false, false, false, false],
		0x6f: [false, false, false, false, false, false, false, false],
		0x70: [false, false, false, false, false, false, false, false],
		0x71: [false, false, false, false, false, false, false, false],
		0x72: [false, false, false, false, false, false, false, false],
		0x73: [false, false, false, false, false, false, false, false],
		0x74: [false, false, false, false, false, false, false, false],
		0x75: [false, false, false, false, false, false, false, false],
		0x76: [false, false, false, false, false, false, false, false],
		0x77: [false, false, false, false, false, false, false, false],
		0x78: [false, false, false, false, false, false, false, false],
		0x79: [false, false, false, false, false, false, false, false],
		0x7a: [false, false, false, false, false, false, false, false],
		0x7b: [false, false, false, false, false, false, false, false],
		0x7c: [false, false, false, false, false, false, false, false],
		0x7d: [false, false, false, false, false, false, false, false],
		0x7e: [false, false, false, false, false, false, false, false],
		0x7f: [false, false, false, false, false, false, false, false],
		0x80: [false, false, false, false, false, false, false, false],
		0x81: [false, false, false, false, false, false, false, false],
		0x82: [false, false, false, false, false, false, false, false],
		0x83: [false, false, false, false, false, false, false, false],
		0x84: [false, false, false, false, false, false, false, false],
		0x85: [false, false, false, false, false, false, false, false],
		0x86: [false, false, false, false, false, false, false, false],
		0x87: [false, false, false, false, false, false, false, false],
		0x88: [false, false, false, false, false, false, false, false],
		0x89: [false, false, false, false, false, false, false, false],
		0x8a: [false, false, false, false, false, false, false, false],
		0x8b: [false, false, false, false, false, false, false, false],
		0x8c: [false, false, false, false, false, false, false, false],
		0x8d: [false, false, false, false, false, false, false, false],
		0x8e: [false, false, false, false, false, false, false, false],
		0x8f: [false, false, false, false, false, false, false, false],
		0x90: [false, false, false, false, false, false, false, false],
		0x91: [false, false, false, false, false, false, false, false],
		0x92: [false, false, false, false, false, false, false, false],
		0x93: [false, false, false, false, false, false, false, false],
		0x94: [false, false, false, false, false, false, false, false],
		0x95: [false, false, false, false, false, false, false, false],
		0x96: [false, false, false, false, false, false, false, false],
		0x97: [false, false, false, false, false, false, false, false],
		0x98: [false, false, false, false, false, false, false, false],
		0x99: [false, false, false, false, false, false, false, false],
		0x9a: [false, false, false, false, false, false, false, false],
		0x9b: [false, false, false, false, false, false, false, false],
		0x9c: [false, false, false, false, false, false, false, false],
		0x9d: [false, false, false, false, false, false, false, false],
		0x9e: [false, false, false, false, false, false, false, false],
		0x9f: [false, false, false, false, false, false, false, false],
		0xa0: [false, false, false, false, false, false, false, false],
		0xa1: [false, false, false, false, false, false, false, false],
		0xa2: [false, false, false, false, false, false, false, false],
		0xa3: [false, false, false, false, false, false, false, false],
		0xa4: [false, false, false, false, false, false, false, false],
		0xa5: [false, false, false, false, false, false, false, false],
		0xa6: [false, false, false, false, false, false, false, false],
		0xa7: [false, false, false, false, false, false, false, false],
		0xa8: [false, false, false, false, false, false, false, false],
		0xa9: [false, false, false, false, false, false, false, false],
		0xaa: [false, false, false, false, false, false, false, false],
		0xab: [false, false, false, false, false, false, false, false],
		0xac: [false, false, false, false, false, false, false, false],
		0xad: [false, false, false, false, false, false, false, false],
		0xae: [false, false, false, false, false, false, false, false],
		0xaf: [false, false, false, false, false, false, false, false],
		0xb0: [false, false, false, false, false, false, false, false],
		0xb1: [false, false, false, false, false, false, false, false],
		0xb2: [false, false, false, false, false, false, false, false],
		0xb3: [false, false, false, false, false, false, false, false],
		0xb4: [false, false, false, false, false, false, false, false],
		0xb5: [false, false, false, false, false, false, false, false],
		0xb6: [false, false, false, false, false, false, false, false],
		0xb7: [false, false, false, false, false, false, false, false],
		0xb8: [false, false, false, false, false, false, false, false],
		0xb9: [false, false, false, false, false, false, false, false],
		0xba: [false, false, false, false, false, false, false, false],
		0xbb: [false, false, false, false, false, false, false, false],
		0xbc: [false, false, false, false, false, false, false, false],
		0xbd: [false, false, false, false, false, false, false, false],
		0xbe: [false, false, false, false, false, false, false, false],
		0xbf: [false, false, false, false, false, false, false, false],
		0xc0: [false, false, false, false, false, false, false, false],
		0xc1: [false, false, false, false, false, false, false, false],
		0xc2: [false, false, false, false, false, false, false, false],
		0xc3: [false, false, false, false, false, false, false, false],
		0xc4: [false, false, false, false, false, false, false, false],
		0xc5: [false, false, false, false, false, false, false, false],
		0xc6: [false, false, false, false, false, false, false, false],
		0xc7: [false, false, false, false, false, false, false, false],
		0xc8: [false, false, false, false, false, false, false, false],
		0xc9: [false, false, false, false, false, false, false, false],
		0xca: [false, false, false, false, false, false, false, false],
		0xcb: [false, false, false, false, false, false, false, false],
		0xcc: [false, false, false, false, false, false, false, false],
		0xcd: [false, false, false, false, false, false, false, false],
		0xce: [false, false, false, false, false, false, false, false],
		0xcf: [false, false, false, false, false, false, false, false],
		0xd0: [false, false, false, false, false, false, false, false],
		0xd1: [false, false, false, false, false, false, false, false],
		0xd2: [false, false, false, false, false, false, false, false],
		0xd3: [false, false, false, false, false, false, false, false],
		0xd4: [false, false, false, false, false, false, false, false],
		0xd5: [false, false, false, false, false, false, false, false],
		0xd6: [false, false, false, false, false, false, false, false],
		0xd7: [false, false, false, false, false, false, false, false],
		0xd8: [false, false, false, false, false, false, false, false],
		0xd9: [false, false, false, false, false, false, false, false],
		0xda: [false, false, false, false, false, false, false, false],
		0xdb: [false, false, false, false, false, false, false, false],
		0xdc: [false, false, false, false, false, false, false, false],
		0xdd: [false, false, false, false, false, false, false, false],
		0xde: [false, false, false, false, false, false, false, false],
		0xdf: [false, false, false, false, false, false, false, false],
		0xe0: [false, false, false, false, false, false, false, false],
		0xe1: [false, false, false, false, false, false, false, false],
		0xe2: [false, false, false, false, false, false, false, false],
		0xe3: [false, false, false, false, false, false, false, false],
		0xe4: [false, false, false, false, false, false, false, false],
		0xe5: [false, false, false, false, false, false, false, false],
		0xe6: [false, false, false, false, false, false, false, false],
		0xe7: [false, false, false, false, false, false, false, false],
		0xe8: [false, false, false, false, false, false, false, false],
		0xe9: [false, false, false, false, false, false, false, false],
		0xea: [false, false, false, false, false, false, false, false],
		0xeb: [false, false, false, false, false, false, false, false],
		0xec: [false, false, false, false, false, false, false, false],
		0xed: [false, false, false, false, false, false, false, false],
		0xee: [false, false, false, false, false, false, false, false],
		0xef: [false, false, false, false, false, false, false, false],
		0xf0: [false, false, false, false, false, false, false, false],
		0xf1: [false, false, false, false, false, false, false, false],
		0xf2: [false, false, false, false, false, false, false, false],
		0xf3: [false, false, false, false, false, false, false, false],
		0xf4: [false, false, false, false, false, false, false, false],
		0xf5: [false, false, false, false, false, false, false, false],
		0xf6: [false, false, false, false, false, false, false, false],
		0xf7: [false, false, false, false, false, false, false, false],
		0xf8: [false, false, false, false, false, false, false, false],
		0xf9: [false, false, false, false, false, false, false, false],
		0xfa: [false, false, false, false, false, false, false, false],
		0xfb: [false, false, false, false, false, false, false, false],
		0xfc: [false, false, false, false, false, false, false, false],
		0xfd: [false, false, false, false, false, false, false, false],
		0xfe: [false, false, false, false, false, false, false, false],
		0xff: [false, false, false, false, false, false, false, false]
	},
	/**
	 * ADC – Add with Carry
	 * 
	 * Adds two registers and the contents of the C Flag and places the result in the destination register Rd.
	 * 
	 * @param _Rd    0 < d < 31
	 * @param _Rr    0 < r < 31
	 */
	adc: function(_Rd, _Rr) {

		var Rd = this.dataspace[_Rd];
		var Rr = this.dataspace[_Rr];
		var R = [false, false, false, false, false, false, false, false];
		var C = [false, false, false, false, false, false, false, false];
		var SREG = this.dataspace[SREG];
		
		/* Operation: Rd <- Rd + Rr + C */
		C[0] = SREG[0];

		R[0] = !!(Rd[0] ^ Rr[0]);
		C[1] = Rd[0] && Rr[0];

		R[1] = !!(Rd[1] ^ Rr[1] ^ C[1]);
		C[2] = (Rd[1] || Rr[1]) && C[1];

		R[2] = !!(Rd[2] ^ Rr[2] ^ C[2]);
		C[3] = (Rd[2] || Rr[2]) && C[2];

		R[3] = !!(Rd[3] ^ Rr[3] ^ C[3]);
		C[4] = (Rd[3] || Rr[3]) && C[3];

		R[4] = !!(Rd[4] ^ Rr[4] ^ C[4]);
		C[5] = (Rd[4] || Rr[4]) && C[4];

		R[5] = !!(Rd[5] ^ Rr[5] ^ C[5]);
		C[6] = (Rd[5] || Rr[5]) && C[5];

		R[6] = !!(Rd[6] ^ Rr[6] ^ C[6]);
		C[7] = (Rd[6] || Rr[6]) && C[6];

		R[7] = !!(Rd[7] ^ Rr[7] ^ C[7]);

		/* C: Set if there was carry from the MSB of the result; cleared otherwise. */
		this.dataspace[SREG][0] = Rd[7] && Rr[7] || Rr[7] && !R[7] || !R[7] && Rd[7];
		/* Z: Set if the result is $00; cleared otherwise. */
		SREG[1] = !R[7] && !R[6] && !R[5] && !R[4] && !R[3] && !R[2] && !R[1] && R[0];
		/* N: Set if MSB of the result is set; cleared otherwise. */
		SREG[2] = R[7];
		/* V: Set if two’s complement overflow resulted from the operation; cleared otherwise. */
		SREG[3] = Rd[7] && Rr[7] && !Rr[7] || !Rd[7] && !Rr[7] && R[7];
		/* S: N ^ V, For signed tests. */
		SREG[4] = !!(SREG[2] ^ SREG[3]);
		/* H: Set if there was a carry from bit 3; cleared otherwise. */
		SREG[5] = Rd[3] && Rr[3] || Rr[3] && !R[3] || !R[3] && Rd[3];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = R;
	},
	/**
	 * ADD – Add without Carry
	 * 
	 * Adds two registers without the C Flag and places the result in the destination register Rd
	 * 
	 * @param _Rd    0 < d < 31
	 * @param _Rr    0 < r < 31
	 */
	add: function(_Rd, _Rr) {

		var Rd = this.dataspace[_Rd];
		var Rr = this.dataspace[_Rr];
		var R = [false, false, false, false, false, false, false, false];
		var C = [false, false, false, false, false, false, false, false];
		var SREG = this.dataspace[this.sreg];

		/* Operation: Rd <- Rd + Rr */
		C[0] = false;

		R[0] = !!(Rd[0] ^ Rr[0]);
		C[1] = Rd[0] && Rr[0];

		R[1] = !!(Rd[1] ^ Rr[1] ^ C[1]);
		C[2] = (Rd[1] || Rr[1]) && C[1];

		R[2] = !!(Rd[2] ^ Rr[2] ^ C[2]);
		C[3] = (Rd[2] || Rr[2]) && C[2];

		R[3] = !!(Rd[3] ^ Rr[3] ^ C[3]);
		C[4] = (Rd[3] || Rr[3]) && C[3];

		R[4] = !!(Rd[4] ^ Rr[4] ^ C[4]);
		C[5] = (Rd[4] || Rr[4]) && C[4];

		R[5] = !!(Rd[5] ^ Rr[5] ^ C[5]);
		C[6] = (Rd[5] || Rr[5]) && C[5];

		R[6] = !!(Rd[6] ^ Rr[6] ^ C[6]);
		C[7] = (Rd[6] || Rr[6]) && C[6];

		R[7] = !!(Rd[7] ^ Rr[7] ^ C[7]);

		/* C: Set if there was carry from the MSB of the result; cleared otherwise. */
		SREG[0] = Rd[7] && Rr[7] || Rr[7] && !R[7] || !R[7] && Rd[7];
		/* Z: Set if the result is $00; cleared otherwise. */
		SREG[1] = !R[7] && !R[6] && !R[5] && !R[4] && !R[3] && !R[2] && !R[1] && R[0];
		/* N: Set if MSB of the result is set; cleared otherwise. */
		SREG[2] = R[7];
		/* V: Set if two’s complement overflow resulted from the operation; cleared otherwise. */
		SREG[3] = Rd[7] && Rr[7] && !Rr[7] || !Rd[7] && !Rr[7] && R[7];
		/* S: N ^ V, For signed tests. */
		SREG[4] = !!(SREG[2] ^ SREG[3]);
		/* H: Set if there was a carry from bit 3; cleared otherwise. */
		SREG[5] = Rd[3] && Rr[3] || Rr[3] && !R[3] || !R[3] && Rd[3];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = R;
	},
	/**
	 * ADIW – Add Immediate to Word
	 *
	 * Adds an immediate value (0 - 63) to a register pair and places the result in the register pair.
	 * This instruction operates on the upper four register pairs,
	 * and is well suited for operations on the pointer registers.
	 * This instruction is not available in all devices. 
	 * Refer to the device specific instruction set summary.
	 *
	 * @param _Rd    d e {24,26,28,30}
	 * @param _Rr    0 <= K <= 63
	 */
	adiw: function(_Rd, _Rr) {

		var Rd = this.dataspace[_Rd];
		var Rr = this.dataspace[_Rr];
		var SREG = this.dataspace[this.sreg];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * AND – Logical AND
	 * 
	 * Performs the logical AND between the contents of register Rd and register Rr 
	 * and places the result in the destination register Rd.
	 *
	 * @param _Rd    Destination register
	 * @param _Rr
	 */
	and: function(_Rd, _Rr) {

		var Rd = this.dataspace[_Rd];
		var Rr = this.dataspace[_Rr];
		var SREG = this.dataspace[this.sreg];
		
		/* Operation: Rd <- Rd && Rr */
		Rd[0] = Rd[0] && Rr[0];
		Rd[1] = Rd[1] && Rr[1];
		Rd[2] = Rd[2] && Rr[2];
		Rd[3] = Rd[3] && Rr[3];
		Rd[4] = Rd[4] && Rr[4];
		Rd[5] = Rd[5] && Rr[5];
		Rd[6] = Rd[6] && Rr[6];
		Rd[7] = Rd[7] && Rr[7];

		/* @TODO */
		SREG[4];
		/* Cleared */
		SREG[3] = false;
		/* Set if MSB of the result is set; cleared otherwise. */
		SREG[2] = Rd[7];
		/* Set if the result is $00; cleared otherwise. */
		SREG[1] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * ANDI – Logical AND with Immediate
	 * 
	 * Performs the logical AND between the contents of register Rd and a constant 
	 * and places the result in the destination register Rd.
	 *
	 * @param _Rd
	 * @param K
	 */
	andi: function(_Rd, K) {

		var Rd = this.dataspace[_Rd];
		var SREG = this.dataspace[this.sreg];

		/* Operation: Rd <- Rd && K */
		Rd[0] = Rd[0] && K[0];
		Rd[1] = Rd[1] && K[1];
		Rd[2] = Rd[2] && K[2];
		Rd[3] = Rd[3] && K[3];
		Rd[4] = Rd[4] && K[4];
		Rd[5] = Rd[5] && K[5];
		Rd[6] = Rd[6] && K[6];
		Rd[7] = Rd[7] && K[7];

		/* @TODO */
		SREG[4];
		/* Cleared */
		SREG[3] = false;
		/* Set if MSB of the result is set; cleared otherwise. */
		SREG[2] = Rd[7];
		/* Set if the result is $00; cleared otherwise. */
		SREG[1] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * ASR – Arithmetic Shift Right
	 *
	 * Shifts all bits in Rd one place to the right. Bit 7 is held constant.
	 * Bit 0 is loaded into the C Flag of the SREG. 
	 * This operation effectively divides a signed value by two without changing its sign.
	 * The Carry Flag can be used to round the result.
	 *
	 * @param _Rd    0 <= d <= 31
	 */
	asr: function(_Rd) {
		
		var Rd = this.dataspace[_Rd];
		var SREG = this.dataspace[this.sreg];

		/* C: Set if, before the shift, the LSB of RD was set; cleared otherwise. */
		SREG[0] = Rd[0];

		/* Operation */
		Rd[0] = Rd[1];
		Rd[1] = Rd[2];
		Rd[2] = Rd[3];
		Rd[3] = Rd[4];
		Rd[4] = Rd[5];
		Rd[5] = Rd[6];
		Rd[6] = Rd[7];
		Rd[7] = Rd[7];

		/* Z: Set if the result is $00; cleared otherwise. */
		SREG[1] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];

		/* N: Set if MSB of the result is set; cleared otherwise. */
		SREG[2] = Rd[7];

		/* V: N ^ C (For N and C after the shift) */
		SREG[3] = !!(SREG[2] ^ SREG[0]);

		/* S: N ^ V, For signed test */
		SREG[4] = !!(SREG[2] ^ SREG[3]);

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/** 
	 * BCLR – Bit Clear in SREG
	 * 
	 * Bit clear in SREG
	 *
	 * @param s
	 */
	bclr: function(s) {

		/* @TODO */
		this.dataspace[this.sreg][s] = false;

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BLD – Bit Load from the T Flag in SREG to a Bit in Register
	 *
	 * Copies the T Flag in the SREG (Status Register) to bit b in register Rd.
	 *
	 * @param _Rd    0 <= d <= 31
	 * @param b      0 <= b <= 7
	 */
	bld: function(_Rd, b) {

		/* Operation: Rd(b) <- T */
		this.dataspace[_Rd] = this.dataspace[this.sreg][6];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRBC – Branch if Bit in SREG is Cleared
	 * 
	 * Conditional relative branch.
	 * Tests a single bit in SREG and branches relatively to PC if the bit is cleared. 
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64). 
	 * The parameter k is the offset from PC and is represented in two’s complement form.
	 * 
	 * @param s
	 * @param k
	 */
	brbc: function(s, k) {

		/* Operation: If SREG(s) = 0 then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][s] === false) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRBS – Branch if Bit in SREG is Set
	 * 
	 * Conditional relative branch. 
	 * Tests a single bit in SREG and branches relatively to PC if the bit is set. 
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64). 
	 * The parameter k is the offset from PC and is represented in two’s complement form.
	 * 
	 * @param s
	 * @param k
	 */
	brbs: function(s, k) {

		/* Operation: If SREG(s) = 1 then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][s] === true) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRCC – Branch if Carry Cleared
	 * 
	 * Conditional relative branch. 
	 * Tests the Carry Flag (C) and branches relatively to PC if C is cleared. 
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64). 
	 * The parameter k is the offset from PC and is represented in two’s complement form. 
	 * (Equivalent to instruction BRBC 0,k).
	 * 
	 * @param k
	 */
	brcc: function(k) {

		/* Operation: If C = 0 then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][0] === false) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRCS – Branch if Carry Set
	 * 
	 * Conditional relative branch. 
	 * Tests the Carry Flag (C) and branches relatively to PC if C is set. 
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64). 
	 * The parameter k is the offset from PC and is represented in two’s complement form. 
	 * (Equivalent to instruction BRBS 0,k).
	 * 
	 * @param k
	 */
	brcs: function(k) {

		/* Operation: If C = 1 then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][0] === true) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BREAK – Break
	 * 
	 * The BREAK instruction is used by the On-chip Debug system, and is normally not used in the application software. 
	 * When the BREAK instruction is executed, the AVR CPU is set in the Stopped Mode. 
	 * This gives the On-chip Debugger access to internal resources.
	 * If any Lock bits are set, or either the JTAGEN or OCDEN Fuses are unprogrammed, 
	 * the CPU will treat the BREAK instruction as a NOP and will not enter the Stopped mode.
	 */
	'break': function() {

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BREQ – Branch if Equal
	 * 
	 * Conditional relative branch. 
	 * Tests the Zero Flag (Z) and branches relatively to PC if Z is set. 
	 * If the instruction is executed immediately after any of the instructions CP, CPI, SUB or SUBI, 
	 * the branch will occur if and only if the unsigned or signed binary number represented in Rd was equal 
	 * to the unsigned or signed binary number represented in Rr. 
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64). 
	 * The parameter k is the offset from PC and is represented in two’s complement form.
	 * (Equivalent to instruction BRBS 1,k).
	 * 
	 * @param {type} k
	 * @returns {undefined}
	 */
	breq: function(k) {

		/* Operation: If Rd = Rr (Z = 1) then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][1] === true) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRGE – Branch if Greater or Equal (Signed)
	 * 
	 * Conditional relative branch. 
	 * Tests the Signed Flag (S) and branches relatively to PC if S is cleared. 
	 * If the instruction is executed immediately after any of the instructions CP, CPI, SUB or SUBI,
	 * the branch will occur if and only if the signed binary number represented in Rd was greater than or equal 
	 * to the signed binary number represented in Rr. 
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64).
	 * The parameter k is the offset from PC and is represented in two’s complement form. 
	 * Equivalent to instruction BRBC 4,k).
	 * 
	 * @param {type} k
	 */
	brge: function(k) {

		/* Operation: If Rd ≥ Rr (N ⊕ V = 0) then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][4] === false) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRHC – Branch if Half Carry Flag is Cleared
	 * 
	 * Conditional relative branch. 
	 * Tests the Half Carry Flag (H) and branches relatively to PC if H is cleared. 
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64). 
	 * The parameter k is the offset from PC and is represented in two’s complement form. 
	 * (Equivalent to instruction BRBC 5,k).
	 * 
	 * @param k
	 */
	brhc: function(k) {

		/* Operation: If H = 0 then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][5] === false) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRHS – Branch if Half Carry Flag is Set
	 * 
	 * Conditional relative branch. 
	 * Tests the Half Carry Flag (H) and branches relatively to PC if H is set. 
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64).
	 * The parameter k is the offset from PC and is represented in two’s complement form. 
	 * (Equivalent to instruction BRBS 5,k).
	 * 
	 * @param k
	 */
	brhs: function(k) {

		/* Operation: If H = 1 then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][5] === true) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRID – Branch if Global Interrupt is Disabled
	 * 
	 * Conditional relative branch. 
	 * Tests the Global Interrupt Flag (I) and branches relatively to PC if I is cleared. 
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64).
	 * The parameter k is the offset from PC and is represented in two’s complement form. 
	 * (Equivalent to instruction BRBC 7,k).
	 * 
	 * @param k
	 */
	brid: function(k) {

		/* If I = 0 then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][7] === false) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRIE – Branch if Global Interrupt is Enabled
	 * 
	 * Conditional relative branch. 
	 * Tests the Global Interrupt Flag (I) and branches relatively to PC if I is set.
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64). 
	 * The parameter k is the offset from PC and is represented in two’s complement form. 
	 * (Equivalent to instruction BRBS 7,k).
	 * 
	 * @param k
	 */
	brie: function(k) {

		/* If I = 1 then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][7] === true) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRLO – Branch if Lower (Unsigned)
	 * 
	 * Conditional relative branch. 
	 * Tests the Carry Flag (C) and branches relatively to PC if C is set. 
	 * If the instruction is executed immediately after any of the instructions CP, CPI, SUB or SUBI, 
	 * the branch will occur if and only if the unsigned binary number represented in Rd was smaller 
	 * than the unsigned binary number represented in Rr. 
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64). 
	 * The parameter k is the offset from PC and is represented in two’s complement form.
	 * (Equivalent to instruction BRBS 0,k).
	 * 
	 * @param k
	 */
	brlo: function(k) {

		/* Operation: If Rd < Rr (C = 1) then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][0] === true) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRLT – Branch if Less Than (Signed)
	 * 
	 * Conditional relative branch. 
	 * Tests the Signed Flag (S) and branches relatively to PC if S is set. 
	 * If the instruction is executed immediately after any of the instructions CP, CPI, SUB or SUBI, 
	 * the branch will occur if and only if the signed binary number represented in Rd was less 
	 * than the signed binary number represented in Rr.
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64). 
	 * The parameter k is the offset from PC and is represented in two’s complement form. 
	 * (Equivalent to instruction BRBS 4,k).
	 * 
	 * @param k
	 */
	brlt: function(k) {

		/* Operation: If Rd < Rr (N ⊕ V = 1) then PC ← PC + k + 1, else PC ← PC + 1 */
		if (this.dataspace[this.sreg][4] === true) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRMI – Branch if Minus
	 * 
	 * Conditional relative branch. 
	 * Tests the Negative Flag (N) and branches relatively to PC if N is set. 
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64). 
	 * The parameter k is the offset from PC and is represented in two’s complement form. 
	 * (Equivalent to instruction BRBS 2,k).
	 * 
	 * @param k
	 */
	brmi: function(k) {

		/* If N = 1 then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][2] === true) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRNE – Branch if Not Equal
	 * 
	 * Conditional relative branch. 
	 * Tests the Zero Flag (Z) and branches relatively to PC if Z is cleared. 
	 * If the instruction is executed immediately after any of the instructions CP, CPI, SUB or SUBI, 
	 * the branch will occur if and only if the unsigned or signed binary number represented in Rd was not equal 
	 * to the unsigned or signed binary number represented in Rr. 
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64).
	 * The parameter k is the offset from PC and is represented in two’s complement form.
	 * (Equivalent to instruction BRBC 1,k).
	 * 
	 * @param k
	 */
	brne: function(k) {

		/* If Rd != Rr (Z = 0) then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][1] === false) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRPL – Branch if Plus
	 * 
	 * Conditional relative branch.
	 * Tests the Negative Flag (N) and branches relatively to PC if N is cleared.
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64).
	 * The parameter k is the offset from PC and is brepresented in two’s complement form.
	 * (Equivalent to instruction BRBC 2,k).
	 * 
	 * @param k
	 */
	brpl: function(k) {

		/* Operation: If N = 0 then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][2] === false) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRSH – Branch if Same or Higher (Unsigned)
	 * 
	 * Conditional relative branch. 
	 * Tests the Carry Flag (C) and branches relatively to PC if C is cleared.
	 * If the instruction is executed immediately after execution of any of the instructions CP, CPI, SUB or SUBI,
	 * the branch will occur if and only if the unsigned binary number represented in Rd was greater than or equal
	 * to the unsigned binary number represented in Rr. 
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64).
	 * The parameter k is the offset from PC and is represented in two’s complement form.
	 * (Equivalent to instruction BRBC 0,k).
	 *
	 * @param k
	 */
	brsh: function(k) {

		/* Operation: If Rd >= Rr (C = 0) then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][0] === false) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRTC – Branch if the T Flag is Cleared
	 * 
	 * Conditional relative branch. 
	 * Tests the T Flag and branches relatively to PC if T is cleared. 
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64). 
	 * The parameter k is the offset from PC and is represented in two’s complement form.
	 * (Equivalent to instruction BRBC 6,k).
	 * 
	 * @param k
	 */
	brtc: function(k) {

		/* Operation: If T = 0 then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][6] === false) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRTS – Branch if the T Flag is Set
	 * 
	 * Conditional relative branch. 
	 * Tests the T Flag and branches relatively to PC if T is set.
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64).
	 * The parameter k is the offset from PC and is represented in two’s complement form.
	 * (Equivalent to instruction BRBS 6,k).
	 * 
	 * @param k
	 */
	brts: function(k) {

		/* Operation: If T = 1 then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][6] === true) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/** 
	 * BVRC - Branch if Overflow Cleared
	 * 
	 * Conditional relative branch. 
	 * Tests the Overflow Flag (V) and branches relatively to PC if V is cleared.
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64). 
	 * The parameter k is the offset from PC and is represented in two’s complement form. 
	 * (Equivalent to instruction BRBC 3,k).
	 * 
	 * @param k
	 */
	brvc: function(k) {

		/* Operation: If V = 0 then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][3] === false) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BRVS – Branch if Overflow Set
	 *
	 * Conditional relative branch. 
	 * Tests the Overflow Flag (V) and branches relatively to PC if V is set. 
	 * This instruction branches relatively to PC in either direction (PC - 63 ≤ destination ≤ PC + 64). 
	 * The parameter k is the offset from PC and is represented in two’s complement form. 
	 * (Equivalent to instruction BRBS 3,k)
	 *
	 * @param k
	 */
	brvs: function(k) {

		/** Operation: If V = 1 then PC <- PC + k + 1, else PC <- PC + 1 */
		if (this.dataspace[this.sreg][3] === true) {
			this.PC = this.PC + k;
		}

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BSET – Bit Set in SREG
	 * 
	 * Sets a single Flag or bit in SREG.
	 * 
	 * @param s
	 */
	bset: function(s) {

		this.dataspace[this.sreg][s] = true;
		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * BST – Bit Store from Bit in Register to T Flag in SREG
	 * 
	 * Stores bit b from Rd to the T Flag in SREG (Status Register).
	 * 
	 * @param _Rd
	 * @param b
	 */
	bst: function(_Rd, b) {

		this.dataspace[this.sreg][6] = _Rd[b];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * CALL - Long Call to a Subroutine
	 *
	 * Calls to a subroutine within the entire Program memory. 
	 * The return address (to the instruction after the CALL) will be stored onto the Stack. 
	 * (See also RCALL). 
	 * The Stack Pointer uses a post-decrement scheme during CALL.
	 *
	 * This instruction is not available in all devices. 
	 * Refer to the device specific instruction set summary.
	 *
	 * @param k    0 <= k <= 64K || 4M
	 */
	call: function(k) {

		/* Operation: PC <- k */
		this.PC = k;

		/* @TODO */


	},
	/**
	 * CBI - Clear Bit in I/O Register
	 *
	 * Clears a specified bit in an I/O Register. 
	 * This instruction operates on the lower 32 I/O Registers – addresses 0-31.
	 *
	 * @param A    0 <= A <= 31
	 * @param b    0 <= b <= 7
	 */
	cbi: function(A, b) {

		/* @TODO */


	},
	/**
	 * CBR – Clear Bits in Register
	 *
	 * Clears the specified bits in register Rd. 
	 * Performs the logical AND between the contents of register Rd and the complement of the constant mask K. 
	 * The result will be placed in register Rd.
	 *
	 * @param _Rd    16 <= d <= 31
	 * @param K      0 <= K <= 255
	 */
	cbr: function(_Rd, K) {

		var Rd = this.dataspace[_Rd];
		var SREG = this.dataspace[this.sreg];

		/* Operation: Rd <- Rd && ($FF - K) */
		Rd[0] = Rd[0] && !K[0];
		Rd[1] = Rd[1] && !K[1];
		Rd[2] = Rd[2] && !K[2];
		Rd[3] = Rd[3] && !K[3];
		Rd[4] = Rd[4] && !K[4];
		Rd[5] = Rd[5] && !K[5];
		Rd[6] = Rd[6] && !K[6];
		Rd[7] = Rd[7] && !K[7];

		/* Z: Set if the result is $00; cleared otherwise */
		SREG[1] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && Rd[0];
		/* N: Set if MSB of the result is set; celared otherwise */
		SREG[2] = Rd[7];
		/* V: Celared */
		SREG[3] = false;
		/* S: N ^ V, For signed tests. */
		SREG[4] = !!(SREG[2] ^ SREG[3]);

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * CLC – Clear Carry Flag
	 * 
	 * Clears the Carry Flag (C) in SREG (Status Register).
	 */
	clc: function() {

		/* Carry Flag cleared */
		this.dataspace[this.sreg][0] = false;

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * CLH – Clear Half Carry Flag 
	 * 
	 * Clears the Half Carry Flag (H) in SREG (Status Register). 
	 */
	clh: function() {

		/* Half Carry Flag cleared */
		this.dataspace[this.sreg][5] = false;

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * CLI – Clear Global Interrupt Flag
	 * 
	 * Clears the Global Interrupt Flag (I) in SREG (Status Register). 
	 * The interrupts will be immediately disabled. 
	 * No interrupt will be executed after the CLI instruction, 
	 * even if it occurs simultaneously with the CLI instruction.
	 */
	cli: function() {

		/* Global Interrupt Flag cleared */
		this.dataspace[this.sreg][7] = false;

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * CLN – Clear Negative Flag 
	 * 
	 * Clears the Negative Flag (N) in SREG (Status Register).
	 */
	cln: function() {

		/* Negative Flag cleared */
		this.dataspace[this.sreg][2] = false;

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * CLR – Clear Register
	 * 
	 * Clears a register. 
	 * This instruction performs an Exclusive OR between a register and itself. 
	 * This will clear all bits in the register.
	 *
	 * @param _Rd    Destination register
	 */
	clr: function(_Rd) {

		var Rd = this.dataspace[_Rd];
		var SREG = this.dataspace[this.sreg];
		
		/* Operation: Rd <- Rd != Rd */
		Rd[0] = Rd[0] !== Rd[0];
		Rd[1] = Rd[1] !== Rd[1];
		Rd[2] = Rd[2] !== Rd[2];
		Rd[3] = Rd[3] !== Rd[3];
		Rd[4] = Rd[4] !== Rd[4];
		Rd[5] = Rd[5] !== Rd[5];
		Rd[6] = Rd[6] !== Rd[6];
		Rd[7] = Rd[7] !== Rd[7];

		SREG[4] = false;
		SREG[3] = false;
		SREG[2] = false;
		SREG[1] = true;

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * CLS – Clear Signed Flag
	 * 
	 * Clears the Signed Flag (S) in SREG (Status Register). 
	 */
	cls: function() {

		/* Signed Flag cleared */
		this.dataspace[this.sreg][4] = false;

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * CLT – Clear T Flag
	 * 
	 * Clears the T Flag in SREG (Status Register).
	 */
	clt: function() {

		/* T Flag cleared */
		this.dataspace[this.sreg][6] = false;

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * CLV – Clear Overflow Flag
	 * 
	 * Clears the Overflow Flag (V) in SREG (Status Register).
	 */
	clv: function() {

		/* Overflow Flag cleared */
		this.dataspace[this.sreg][3] = false;

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * CLZ – Clear Zero Flag 
	 * 
	 * Clears the Zero Flag (Z) in SREG (Status Register). 
	 */
	clz: function() {

		/* Zero Flag cleared */
		this.dataspace[this.sreg][1] = false;

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * COM - One's Complement
	 * 
	 * This instruction performs a One’s Complement of register Rd.
	 *
	 * @param _Rd    0 <= d <= 31
	 */
	com: function(_Rd) {

		var Rd = this.dataspace[_Rd];
		var SREG = this.dataspace[this.sreg];

		/* Operation Rd <- $FF - Rd */
		Rd[0] = !Rd[0];
		Rd[1] = !Rd[1];
		Rd[2] = !Rd[2];
		Rd[3] = !Rd[3];
		Rd[4] = !Rd[4];
		Rd[5] = !Rd[5];
		Rd[6] = !Rd[6];
		Rd[7] = !Rd[7];

		/* C: Set */
		SREG[0] = true;
		/* Z: Set if the result is $00; cleared otherwise */
		SREG[1] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && Rd[0];
		/* N: Set if MSB of the result is set; celared otherwise */
		SREG[2] = Rd[7];
		/* V: Celared */
		SREG[3] = false;
		/* S: N ^ V, For signed tests. */
		SREG[4] = !!(SREG[2] ^ SREG[3]);

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * CP - Compare
	 *
	 * This instruction performs a compare between two registers Rd and Rr. None of the registers are changed.
	 * All conditional branches can be used after this instruction.
	 *
	 * @param _Rd    0 <= d <= 31
	 * @param _Rr    0 <= r <= 31
	 */
	cp: function(_Rd, _Rr) {

		var Rd = this.dataspace[_Rd];
		var Rr = this.dataspace[_Rr];
		var R = [false, false, false, false, false, false, false, false];
		var SREG = this.dataspace[this.sreg];

		/* Operation: Rd - Rr */

		/* @TODO */

		/* C: Set if the absolute value of the contents of Rr is larger than the absolute value of Rd; cleared otherwise. */
		SREG[0] = !Rd[7] && Rr[7] || Rr[7] && R[7] || R[7] && !Rd[7];
		/* Z: Set if the result is $00; cleared otherwise */
		SREG[1] = !R[7] && !R[6] && !R[5] && !R[4] && !R[3] && !R[2] && !R[1] && R[0];
		/* N: Set if MSB of the result is set; cleared otherwise */
		SREG[2] = R[7];
		/* V: Set if two’s complement overflow resulted from the operation; cleared otherwise. */
		SREG[3] = Rd[7] && !Rr[7] && !R[7] || !Rd[7] && Rr[7] && R[7];
		/* S: N ^ V, For signed tests. */
		SREG[4] = !!(SREG[2] ^ SREG[3]);
		/* H: Set if there was a borrow from bit 3; cleared otherwise */
		SREG[5] = !Rd[3] && Rr[3] || Rr[3] && R[3] || R[3] && !Rd[3];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * CPC - Compare with Carry
	 *
	 * This instruction performs a compare between two registers Rd and Rr and also takes into account the previous carry. 
	 * None of the registers are changed. 
	 * All conditional branches can be used after this instruction.
	 *
	 * @param _Rd    0 <= d <= 31
	 * @param _Rr    0 <= r <= 31
	 */
	cpc: function(_Rd, _Rr) {

		var Rd = this.dataspace[_Rd];
		var Rr = this.dataspace[_Rr];
		var R = [false, false, false, false, false, false, false, false];
		var SREG = this.dataspace[this.sreg];

		/* Operation: Rd - Rr - C */


		/* @TODO */

		/* C: Set if the absolute value of the contents of Rr is larger than the absolute value of Rd; cleared otherwise. */
		SREG[0] = !Rd[7] && Rr[7] || Rr[7] && R[7] || R[7] && !Rd[7];
		/* Z: Set if the result is $00; cleared otherwise */
		SREG[1] = !R[7] && !R[6] && !R[5] && !R[4] && !R[3] && !R[2] && !R[1] && R[0];
		/* N: Set if MSB of the result is set; cleared otherwise */
		SREG[2] = R[7];
		/* V: Set if two’s complement overflow resulted from the operation; cleared otherwise. */
		SREG[3] = Rd[7] && !Rr[7] && !R[7] || !Rd[7] && Rr[7] && R[7];
		/* S: N ^ V, For signed tests. */
		SREG[4] = !!(SREG[2] ^ SREG[3]);
		/* H: Set if there was a borrow from bit 3; cleared otherwise */
		SREG[5] = !Rd[3] && Rr[3] || Rr[3] && R[3] || R[3] && !Rd[3];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * CPI - Compare with Immediate
	 *
	 * This instruction performs a compare between register Rd and a constant.
	 * The register is not changed. 
	 * All conditional branches can be used after this instruction.
	 *
	 * @param _Rd    16 <= d <= 31
	 * @param K      0 <= K <= 255
	 */
	cpi: function(_Rd, K) {

		var Rd = this.dataspace[_Rd];
		var SREG = this.dataspace[this.sreg];

		/* Operation: Rd - K */

		/* @TODO */

		/* C: Set if the absolute value of K is larger than the absolute value of Rd; cleared otherwise. */
		SREG[0] = !Rd[7] && K[7] || K[7] && R[7] || R[7] && !Rd[7];
		/* Z: Set if the result is $00; cleared otherwise */
		SREG[1] = !R[7] && !R[6] && !R[5] && !R[4] && !R[3] && !R[2] && !R[1] && R[0];
		/* N: Set if MSB of the result is set; cleared otherwise */
		SREG[2] = R[7];
		/* V: Set if two’s complement overflow resulted from the operation; cleared otherwise. */
		SREG[3] = Rd[7] && !K[7] && !R[7] || !Rd[7] && K[7] && R[7];
		/* S: N ^ V, For signed tests. */
		SREG[4] = !!(SREG[2] ^ SREG[3]);
		/* H: Set if there was a borrow from bit 3; cleared otherwise */
		SREG[5] = !Rd[3] && K[3] || K[3] && R[3] || R[3] && !Rd[3];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * CPSE - Compare Skip if Equal
	 *
	 * This instruction performs a compare between two registers Rd and Rr,
	 * and skips the next instruction if Rd = Rr.
	 *
	 * @param _Rd    0 <= d <= 31
	 * @param _Rr    0 <= r <= 31
	 */
	cpse: function(_Rd, _Rr) {

		var Rd = this.dataspace[_Rd];
		var Rr = this.dataspace[_Rr];
		var SREG = this.dataspace[this.sreg];

		/* Operation if Rd = Rr then PC <- PC + 2 (or 3) else PC <- PC + 1 */
		if (
				Rd[0] === Rr[0] &&
				Rd[1] === Rr[1] &&
				Rd[2] === Rr[2] &&
				Rd[3] === Rr[3] &&
				Rd[4] === Rr[4] &&
				Rd[5] === Rr[5] &&
				Rd[6] === Rr[6] &&
				Rd[7] === Rr[7]
				) {
			/* Program Counter: PC <- PC + 2, Skip a one word instruction */
			this.PC += 2;
		}
		else {
			/* Program Counter: PC <- PC + 1, Condition false - no skip */
			this.PC++;
		}
	},
	/**
	 * DEC - Decrement
	 * 
	 * Subtracts one -1- from the contents of register Rd and places the result in the destination register Rd.
	 * The C Flag in SREG is not affected by the operation, 
	 * thus allowing the DEC instruction to be used on a loop counter in multiple-precision computations.
	 * When operating on unsigned values, only BREQ and BRNE branches can be expected to perform consistently. 
	 * When operating on two’s complement values, all signed branches are available.
	 *
	 * @param _Rd    0 <= d <= 31
	 */
	dec: function(_Rd) {

		/* Operation: Rd <- Rd - 1 */

		/* @TODO */


		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * DES – Data Encryption Standard
	 *
	 *
	 *
	 *
	 *
	 *
	 * @param K
	 */
	des: function(K) {

		/* @TODO */

	},
	/**
	 * EICALL – Extended Indirect Call to Subroutine
	 *
	 *
	 *
	 *
	 */
	eicall: function() {

		/* @TODO */

	},
	/**
	 * EIJMP – Extended Indirect Jump
	 *
	 *
	 */
	eijmp: function() {


		/* @TODO */
	},
	/**
	 * ELPM – Extended Load Program Memory
	 *
	 *
	 *
	 */
	elpm: function() {

		/* @TODO */
	},
	/**
	 * EOR – Exclusive OR
	 * 
	 * Performs the logical EOR between the contents of register Rd and register Rr
	 * and places the result in the destination register Rd.
	 *
	 * @param _Rd
	 * @param _Rr
	 */
	eor: function(_Rd, _Rr) {

		var Rd = this.dataspace[_Rd];
		var Rr = this.dataspace[_Rr];
		var SREG = this.dataspace[this.sreg];

		/* Operation: Rd <- Rd != Rr */
		Rd[0] = Rd[0] !== Rr[0];
		Rd[1] = Rd[1] !== Rr[1];
		Rd[2] = Rd[2] !== Rr[2];
		Rd[3] = Rd[3] !== Rr[3];
		Rd[4] = Rd[4] !== Rr[4];
		Rd[5] = Rd[5] !== Rr[5];
		Rd[6] = Rd[6] !== Rr[6];
		Rd[7] = Rd[7] !== Rr[7];

		/* @TODO */
		SREG[4];
		/* Cleared */
		SREG[3] = false;
		/* Set if MSB of the result is set; cleared otherwise. */
		SREG[2] = Rd[7];
		/* Set if the result is $00; cleared otherwise. */
		SREG[1] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * FMUL – Fractional Multiply Unsigned
	 */
	fmul: function() {

		/* @TODO */
	},
	/**
	 * FMULS – Fractional Multiply Signed
	 *
	 */
	fmuls: function() {


		/* @TODO */

	},
	/**
	 * FMULSU – Fractional Multiply Signed with Unsigned
	 */
	fmulsu: function() {

		/* @TODO */
	},
	/**
	 * ICALL – Indirect Call to Subroutine
	 *
	 */
	icall: function() {

		/* @TODO */
	},
	/**
	 * IJMP – Indirect Jump
	 */
	ijmp: function() {

		/* @TODO */
	},
	/**
	 * IN - Load an I/O Location to Register
	 * 
	 * Loads data from the I/O Space (Ports, Timers, Configuration Registers etc.) 
	 * into register Rd in the Register File.
	 *
	 * @param _Rd    0 <= d <= 31
	 * @param A      0 <= A <= 63
	 */
	in: function(_Rd, A) {

		var Rd = this.dataspace[Rd];
		var A = this.io[A];

		/* Operation: Rd <- I/O(A) */
		Rd[0] = A[0];
		Rd[1] = A[1];
		Rd[2] = A[2];
		Rd[3] = A[3];
		Rd[4] = A[4];
		Rd[5] = A[5];
		Rd[6] = A[6];
		Rd[7] = A[7];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * INC – Increment
	 * 
	 * Adds one -1- to the contents of register Rd and places the result in the destination register Rd. 
	 * The C Flag in SREG is not affected by the operation, 
	 * thus allowing the INC instruction to be used on a loop counter in multiple-precision computations. 
	 * When operating on unsigned numbers, only BREQ and BRNE branches can be expected to perform consistently. 
	 * When operating on two’s complement values, all signed branches are available.
	 * 
	 * @param _Rd    0 <= d <= 31
	 */
	inc: function(_Rd) {

		var Rd = this.dataspace[_Rd];
		var R = [false, false, false, false, false, false, false, false];
		var C = [false, false, false, false, false, false, false, false];
		var SREG = this.dataspace[this.sreg];

		/* Operation: Rd <- Rd + Rr */
		C[0] = false;

		R[0] = !Rd[0];
		C[1] = Rd[0];

		R[1] = !!(Rd[1] ^ C[1]);
		C[2] = Rd[1] && C[1];

		R[2] = !!(Rd[2] ^ C[2]);
		C[3] = Rd[2] && C[2];

		R[3] = !!(Rd[3] ^ C[3]);
		C[4] = Rd[3] && C[3];

		R[4] = !!(Rd[4] ^ C[4]);
		C[5] = Rd[4] && C[4];

		R[5] = !!(Rd[5] ^ C[5]);
		C[6] = Rd[5] && C[5];

		R[6] = !!(Rd[6] ^ C[6]);
		C[7] = Rd[6] && C[6];

		R[7] = !!(Rd[7] ^ C[7]);

		/* Z: Set if the result is $00; cleared otherwise. */
		SREG[1] = !R[7] && !R[6] && !R[5] && !R[4] && !R[3] && !R[2] && !R[1] && R[0];
		/* N: Set if MSB of the result is set; cleared otherwise. */
		SREG[2] = R[7];
		/* V: Set if two’s complement overflow resulted from the operation; cleared otherwise. */
		SREG[3] = R[7] && !R[6] && !R[5] && !R[4] && !R[3] && !R[2] && !R[1] && !R[0];
		/* S: N ^ V, For signed tests. */
		SREG[4] = !!(SREG[2] ^ SREG[3]);

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = R;
	},
	/**
	 * JMP – Jump
	 * 
	 * Jump to an address within the entire 4M (words) Program memory. 
	 * See also RJMP.
	 * 
	 * @param k
	 */
	jmp: function(k) {

		/* @TODO */

		/* Program Counter: PC <- k */
		this.PC = k;

	},
	/**
	 * LAC - Load And Clear
	 *
	 * @param Z
	 * @param _Rd    0 <= d <= 31
	 */
	lac: function(Z, _Rd) {

		/* Operation: (Z) <- Rd && ($FF - (Z)) */

		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * LAS - Load And Set
	 *
	 * @param Z
	 * @param _Rd    0 <= d <= 31
	 */
	las: function(Z, _Rd) {

		/* Operation: (Z) <- Rd v (Z), Rd <- (Z) */

		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * LAT - Load And Toggle 
	 *
	 * @param Z
	 * @param _Rd    0 <= d <= 31 
	 */
	lat: function(Z, _Rd) {

		/* @TODO */


		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * LD - Load Indirect from Data Space to Register using Index X
	 */
	ld: function() {

		/* @TODO */
	},
	/**
	 * LDI – Load Immediate
	 * 
	 * Loads an 8 bit constant directly to register 16 to 31.
	 * 
	 * @param {type} _Rd
	 * @param {type} K
	 */
	ldi: function(_Rd, K) {

		var Rd = this.dataspace[_Rd];

		/* Operation Rd <- K */
		Rd[0] = K[0];
		Rd[1] = K[1];
		Rd[2] = K[2];
		Rd[3] = K[3];
		Rd[4] = K[4];
		Rd[5] = K[5];
		Rd[6] = K[6];
		Rd[7] = K[7];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * LDS - Load Direct from Data Space
	 *
	 * Loads one byte from the data space to a register.
	 * For parts with SRAM, the data space consists of the Register File, 
	 * I/O memory and internal SRAM (and external SRAM if applicable)
	 * For parts without SRAM, the data space consists of the register file only. 
	 * The EEPROM has a separate address space.
	 *
	 * A 16-bit address must be supplied. 
	 * Memory access is limited to the current data segment of 64K bytes. 
	 * The LDS instruction uses the RAMPD Register to access memory above 64K bytes.
	 * To access another data segment in devices with more than 64K bytes data space, 
	 * the RAMPD in register in the I/O area has to be changed.
	 *
	 * This instruction is not available in all devices. 
	 * Refer to the device specific instruction set summary.
	 *
	 * @param _Rd    0 <= d <= 31
	 * @param k      0 <= k <= 65535
	 */
	lds: function(_Rd, k) {

		var Rd = this.dataspace[_Rd];

		/* @TODO */

		/* Operation: Rd <- (k) */
		Rd[0] = this.ds[k][0];
		Rd[1] = this.ds[k][1];
		Rd[2] = this.ds[k][2];
		Rd[3] = this.ds[k][3];
		Rd[4] = this.ds[k][4];
		Rd[5] = this.ds[k][5];
		Rd[6] = this.ds[k][6];
		Rd[7] = this.ds[k][7];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * LPM - Load Program Memory 
	 *
	 */
	lpm: function() {

		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 *  Logical Shift Left
	 *  
	 *  Shifts all bits in Rd one place to the left. 
	 *  Bit 0 is cleared. 
	 *  Bit 7 is loaded into the C Flag of the SREG. 
	 *  This operation effectively multiplies signed and unsigned values by two.
	 *  
	 *  @param _Rd
	 */
	lsl: function(_Rd) {

		var Rd = this.dataspace[_Rd];
		var SREG = this.dataspace[this.sreg];

		/* Set if, before the shift, the MSB of Rd was set; cleared otherwise. */
		SREG[0] = Rd[7];

		/* Operation */
		Rd[7] = Rd[6];
		Rd[6] = Rd[5];
		Rd[5] = Rd[4];
		Rd[4] = Rd[3];
		Rd[3] = Rd[2];
		Rd[2] = Rd[1];
		Rd[1] = Rd[0];
		Rd[0] = false;

		/* @TODO */
		SREG[5] = Rd[3];
		/* For signed tests. */
		SREG[4] = !!(SREG[2] ^ SREG[3]);
		/* For N and C after the shift. */
		SREG[3] = !!(SREG[2] ^ SREG[0]);
		/* Set if MSB of the result is set; cleared otherwise. */
		SREG[2] = Rd[7];
		/* Set if the result is $00; cleared otherwise */
		SREG[1] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * Logical Shift Right
	 * 
	 * Shifts all bits in Rd one place to the right. 
	 * Bit 7 is cleared. 
	 * Bit 0 is loaded into the C Flag of the SREG. 
	 * This operation effectively divides an unsigned value by two. 
	 * The C Flag can be used to round the result.
	 * 
	 * @param  _Rd
	 */
	lsr: function(_Rd) {

		var Rd = this.dataspace[_Rd];
		var SREG = this.dataspace[this.sreg];

		/* Set if, before the shift, the LSB of Rd was set; cleared otherwise */
		SREG[0] = Rd[0];

		/* Operation */
		Rd[0] = Rd[1];
		Rd[1] = Rd[2];
		Rd[2] = Rd[3];
		Rd[3] = Rd[4];
		Rd[4] = Rd[5];
		Rd[5] = Rd[6];
		Rd[6] = Rd[7];
		Rd[7] = false;

		/* @TODO */
		/* For signed tests. */
		SREG[4] = !!(SREG[2] ^ SREG[3]);
		/* For N and C after the shift. */
		SREG[3] = !!(SREG[2] ^ SREG[0]);
		SREG[2] = false;
		/* Set if the result is $00; cleared otherwise */
		SREG[1] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * MOV – Copy Registe
	 * 
	 * This instruction makes a copy of one register into another. 
	 * The source register Rr is left unchanged, 
	 * while the destination register Rd is loaded with a copy of Rr.
	 *
	 * @param _Rd
	 * @param _Rr
	 */
	mov: function(_Rd, _Rr) {

		var Rd = this.dataspace[_Rd];
		var Rr = this.dataspace[_Rr];

		/* Operation: Rd <- Rr */
		Rd[0] = Rr[0];
		Rd[1] = Rr[1];
		Rd[2] = Rr[2];
		Rd[3] = Rr[3];
		Rd[4] = Rr[4];
		Rd[5] = Rr[5];
		Rd[6] = Rr[6];
		Rd[7] = Rr[7];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * MOVW – Copy Register Word
	 * 
	 * This instruction makes a copy of one register pair into another register pair. 
	 * The source register pair Rr+1:Rr is left unchanged, 
	 * while the destination register pair Rd+1:Rd is loaded with a copy of Rr + 1:Rr.
	 *
	 * @param _Rd
	 * @param _Rr
	 */
	movw: function(_Rd, _Rr) {

		var Rd = this.dataspace[_Rd];
		var Rd1 = this.dataspace[_Rd + 1];
		var Rr = this.dataspace[_Rr];
		var Rr1 = this.dataspace[_Rr + 1];

		/* Operation: Rd+1:Rd <- Rr+1:Rr */
		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	mul: function() {
		/* @TODO */


		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	muls: function() {
		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	mulsu: function() {

		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	neg: function() {

		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * NOP – No Operation
	 * 
	 * This instruction performs a single cycle No Operation.
	 */
	nop: function() {

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * OR – Logical OR
	 * 
	 * Performs the logical OR between the contents of register Rd and register Rr 
	 * and places the result in the destination register Rd.
	 *
	 * @param _Rd
	 * @param _Rr
	 */
	or: function(_Rd, _Rr) {

		var Rd = this.dataspace[_Rd];
		var Rr = this.dataspace[_Rr];
		var SREG = this.dataspace[this.sreg];

		/* Operation: Rd <- Rd || Rr */
		Rd[0] = Rd[0] || Rr[0];
		Rd[1] = Rd[1] || Rr[1];
		Rd[2] = Rd[2] || Rr[2];
		Rd[3] = Rd[3] || Rr[3];
		Rd[4] = Rd[4] || Rr[4];
		Rd[5] = Rd[5] || Rr[5];
		Rd[6] = Rd[6] || Rr[6];
		Rd[7] = Rd[7] || Rr[7];

		/* @TODO */
		SREG[4];
		/* Cleared */
		SREG[3] = false;
		/* Set if MSB of the result is set; cleared otherwise. */
		SREG[2] = Rd[7];
		/* Set if the result is $00; cleared otherwise. */
		SREG[1] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * ORI – Logical OR with Immediate
	 * 
	 * Performs the logical OR between the contents of register Rd and a constant 
	 * and places the result in the destination register Rd.
	 *
	 * @param _Rd
	 * @param K
	 */
	ori: function(_Rd, K) {

		var Rd = this.dataspace[_Rd];
		var SREG = this.dataspace[this.sreg];

		/* Operation: Rd <- Rd v K */
		Rd[0] = Rd[0] || K[0];
		Rd[1] = Rd[1] || K[1];
		Rd[2] = Rd[2] || K[2];
		Rd[3] = Rd[3] || K[3];
		Rd[4] = Rd[4] || K[4];
		Rd[5] = Rd[5] || K[5];
		Rd[6] = Rd[6] || K[6];
		Rd[7] = Rd[7] || K[7];

		/* @TODO */
		SREG[4];
		/* Cleared */
		SREG[3] = false;
		/* Set if MSB of the result is set; cleared otherwise. */
		SREG[2] = Rd[7];
		/* Set if the result is $00; cleared otherwise. */
		SREG[1] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * OUT – Store Register to I/O Location
	 * 
	 * Stores data from register Rr in the Register File to I/O Space (Ports, Timers, Configuration Registers etc.).
	 * 
	 * @param A
	 * @param _Rr
	 */
	out: function(A, _Rr) {

		/* @TODO */

	},
	/**
	 * POP – Pop Register from Stack
	 * 
	 * This instruction loads register Rd with a byte from the STACK. 
	 * The Stack Pointer is pre-incremented by 1 before the POP.
	 *
	 * @param _Rd
	 */
	pop: function(_Rd) {

		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * PUSH – Push Register on Stack
	 * 
	 * This instruction stores the contents of register Rr on the STACK. 
	 * The Stack Pointer is post-decremented by 1 after the PUSH.
	 *
	 * @param _Rr
	 */
	push: function(_Rr) {

		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	rcall: function() {

		/* @TODO */



		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	ret: function() {

		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	reti: function() {

		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * RJMP – Relative Jump 
	 * 
	 * Relative jump to an address within PC - 2K +1 and PC + 2K (words).
	 * For AVR microcontrollers with Program memory not exceeding 4K words (8K bytes) this instruction can address 
	 * the entire memory from every address location. See also JMP.
	 * 
	 * @param k    -2K <= k <= 2K
	 */
	rjmp: function(k) {

		/* Program Counter: PC ← PC + k + 1 */
		this.PC += k + 1;
	},
	/**
	 * ROL – Rotate Left trough Carry
	 * 
	 * Shifts all bits in Rd one place to the left. 
	 * The C Flag is shifted into bit 0 of Rd. 
	 * Bit 7 is shifted into the C Flag. 
	 * This operation, combined with LSL, effectively multiplies multi-byte signed and unsigned values by two.
	 * 
	 * @param _Rd
	 */
	rol: function(_Rd) {

		var Rd = this.dataspace[_Rd];
		var SREG = this.dataspace[this.sreg];

		/* Rd3 */
		SREG[5] = Rd[3];
		/* Set if, before the shift, the MSB of Rd was set; cleared otherwise. */
		SREG[0] = Rd[7];

		/* Operation: C <- b7 <- ... <- b0 <- C */
		Rd[7] = Rd[6];
		Rd[6] = Rd[5];
		Rd[5] = Rd[4];
		Rd[4] = Rd[3];
		Rd[3] = Rd[2];
		Rd[2] = Rd[1];
		Rd[1] = Rd[0];
		Rd[0] = SREG[0];

		/* Set if MSB of the result is set; cleared otherwise. */
		SREG[2] = Rd[7];
		/* N ^ C (For N and C after the shift) */
		SREG[3] = !!(SREG[2] ^ SREG[0]);
		/* N ^ V, For signed tests. */
		SREG[4] = !!(SREG[2] ^ SREG[3]);
		/* Set if the result is $00; cleared otherwise. */
		SREG[1] = !Rd[0] && !Rd[1] && !Rd[2] && !Rd[3] && !Rd[4] && !Rd[5] && !Rd[6] && !Rd[7];

		/* Program counter: PC <- PC + 1 */
		this.PC++;

		/* Save changes */
		this.dataspace[_Rd] = Rd;
	},
	/**
	 * ROR – Rotate Right through Carry
	 * 
	 * Shifts all bits in Rd one place to the right. 
	 * The C Flag is shifted into bit 7 of Rd.
	 * Bit 0 is shifted into the C Flag. 
	 * This operation, combined with ASR, effectively divides multi-byte signed values by two. 
	 * Combined with LSR it effectively divides multibyte unsigned values by two. 
	 * The Carry Flag can be used to round the result.
	 * 
	 * @param _Rd
	 */
	ror: function(_Rd) {

		var Rd = this.dataspace[_Rd];
		var SREG = this.dataspace[this.sreg];

		/* Rd3 */
		SREG[5] = Rd[3];
		/* Set if, before the shift, the MSB of Rd was set; cleared otherwise. */
		SREG[0] = Rd[0];

		Rd[0] = Rd[1];
		Rd[1] = Rd[2];
		Rd[2] = Rd[3];
		Rd[3] = Rd[4];
		Rd[4] = Rd[5];
		Rd[5] = Rd[6];
		Rd[6] = Rd[7];
		Rd[7] = SREG[0];

		/* Set if MSB of the result is set; cleared otherwise. */
		SREG[2] = Rd[7];
		/* N ^ C (For N and C after the shift) */
		SREG[3] = !!(SREG[2] ^ SREG[0]);
		/* N ^ V, For signed tests. */
		SREG[4] = !!(SREG[2] ^ SREG[3]);
		/* Set if the result is $00; cleared otherwise. */
		SREG[1] = !Rd[0] && !Rd[1] && !Rd[2] && !Rd[3] && !Rd[4] && !Rd[5] && !Rd[6] && !Rd[7];

		/* Program counter: PC <- PC + 1 */
		this.PC++;

		/* Save changes */
		this.dataspace[_Rd] = Rd;
	},
	/**
	 * SBC – Subtract with Carry
	 * 
	 * Subtracts two registers and subtracts with the C Flag and places the result in the destination register Rd.
	 * 
	 * @param _Rd
	 * @param _Rr
	 */
	sbc: function(_Rd, _Rr) {

		/* Operation: Rd <- Rd - Rr - C */

		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * SBCI – Subtract Immediate with Carry
	 * 
	 * Subtracts a constant from a register and subtracts with the C Flag 
	 * and places the result in the destination register Rd.
	 * 
	 * @param _Rd    16 <= d <= 31
	 * @param K       0 <= K <= 255
	 */
	sbci: function(_Rd, K) {

		/* Operation: Rd <- Rd - K - C */

		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * SBI – Set Bit in I/O Register
	 * 
	 * Sets a specified bit in an I/O Register. 
	 * This instruction operates on the lower 32 I/O Registers – addresses 0-31
	 * 
	 * @param A    0 <= A <= 31
	 * @param b    0 <= b <= 7
	 */
	sbi: function(A, b) {

		/* Operation: I/O(A,b) <- 1 */
		this.io[A][b] = true;

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * SBIC – Skip if Bit in I/O Register is Cleared
	 * 
	 * This instruction tests a single bit in an I/O Register and skips the next instruction if the bit is cleared. 
	 * This instruction operates on the lower 32 I/O Registers – addresses 0-31.
	 * 
	 * @param A    0 <= A <= 31
	 * @param b    0 <= b <= 7
	 */
	sbic: function(A, b) {

		/* Operation: If I/O(A,b) = 0 then PC <- PC + 2 (or 3) else PC <- PC + 1  */
		if (this.io[A][b] === false) {
			/* Program Counter: PC <- PC + 2, Skip a one word instruction */
			this.PC += 2;
		}
		else {
			/* Program Counter: PC <- PC + 1, Condition false - no skip */
			this.PC++;
		}
	},
	/**
	 * SBIS – Skip if Bit in I/O Register is Set
	 * 
	 * This instruction tests a single bit in an I/O Register and skips the next instruction if the bit is set. 
	 * This instruction operates on the lower 32 I/O Registers – addresses 0-31.
	 * 
	 * @param A    0 <= A <= 31
	 * @param b    0 <= b <= 7
	 */
	sbis: function(A, b) {

		/* Operation: If I/O(A,b) = 1 then PC <- PC + 2 (or 3) else PC <- PC + 1  */
		if (this.io[A][b] === true) {
			/* Program Counter: PC <- PC + 2, Skip a one word instruction */
			this.PC += 2;
		}
		else {
			/* Program Counter: PC <- PC + 1, Condition false - no skip */
			this.PC++;
		}
	},
	/**
	 * SBIW - SBIW – Subtract Immediate from Word
	 * 
	 * Subtracts an immediate value (0-63) from a register pair and places the result in the register pair.
	 * This instruction operates on the upper four register pairs, 
	 * and is well suited for operations on the Pointer Registers. 
	 * This instruction is not available in all devices. 
	 * Refer to the device specific instruction set summary.
	 * 
	 * @param _Rd    Rd e {24,26,28,30}
	 * @param K      0 <= K <= 63
	 */
	sbiw: function(_Rd, K) {

		/* @TODO */

	},
	/**
	 * SBR - Set Bits in Register
	 * 
	 * Sets specified bits in register Rd.
	 * Performs the logical ORI between the contents of register Rd and a constant mask K 
	 * and places the result in the destination register Rd.
	 * 
	 * @param {type} _Rd
	 * @param {type} K
	 */
	sbr: function(_Rd, K) {

		var Rd = this.dataspace[_Rd];

		/* Operation: Rd <- Rd v K */
		Rd[0] = Rd[0] || K[0];
		Rd[1] = Rd[1] || K[1];
		Rd[2] = Rd[2] || K[2];
		Rd[3] = Rd[3] || K[3];
		Rd[4] = Rd[4] || K[4];
		Rd[5] = Rd[5] || K[5];
		Rd[6] = Rd[6] || K[6];
		Rd[7] = Rd[7] || K[7];

		/* Z: Set if the result is $00; cleared othervise. */
		this.dataspace[1] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];
		/* N: Set if MSB of the result is set; cleared othervise. */
		this.dataspace[2] = Rd[7];
		/* V: Cleared */
		this.dataspace[3] = false;
		/* S: N ^ V, For signed tests. */
		this.dataspace[4] = !!(this.dataspace[2] ^ this.dataspace[3]);

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * SBRC – Skip if Bit in Register is Cleared
	 * 
	 * This instruction tests a single bit in a register and skips the next instruction if the bit is cleared.
	 * 
	 * @param _Rr
	 * @param b
	 */
	sbrc: function(_Rr, b) {

		/* Operation: If Rr(b) = 0 then PC <- PC + 2 (or 3) else PC <- PC + 1 */
		if (this.dataspace[_Rr][b] === false) {
			/* Program Counter: PC <- PC + 2, Skip a one word instruction */
			this.PC += 2;
		} else {
			/* Program Counter: PC <- PC + 1, Condition false - no skip */
			this.PC++;
		}
	},
	/**
	 * SBRS – Skip if Bit in Register is Set
	 * 
	 * This instruction tests a single bit in a register and skips the next instruction if the bit is set.
	 * 
	 * @param _Rr
	 * @param b
	 */
	sbrs: function(_Rr, b) {

		/* Operation: If Rr(b) = 1 then PC <- PC + 2 (or 3) else PC <- PC + 1 */
		if (this.dataspace[_Rr][b] === true) {
			/* Program Counter: PC <- PC + 2, Skip a one word instruction */
			this.PC += 2;
		} else {
			/* Program Counter: PC <- PC + 1, Condition false - no skip */
			this.PC++;
		}
	},
	/**
	 * SEC – Set Carry Flag
	 * 
	 * Sets the Carry Flag (C) in SREG (Status Register).
	 */
	sec: function() {

		/* Operation: C <- 1 */
		this.dataspace[this.sreg][0] = true;

		/* Program counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * SEH – Set Half Carry Flag 
	 * 
	 * Sets the Half Carry (H) in SREG (Status Register).
	 */
	seh: function() {

		/* Operation: H <- 1 */
		this.dataspace[this.sreg][5] = true;

		/* Program counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * SEI – Set Global Interrupt Flag
	 * 
	 * Sets the Global Interrupt Flag (I) in SREG (Status Register). 
	 * The instruction following SEI will be executed before any pending interrupts.
	 */
	sei: function() {

		/* Operation: I <- 1 */
		this.dataspace[this.sreg][7] = true;

		/* Program counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * SEN – Set Negative Flag
	 * 
	 * Sets the Negative Flag (N) in SREG (Status Register).
	 */
	sen: function() {

		/* Operation: N <- 1 */
		this.dataspace[this.sreg][2] = true;

		/* Program counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * SER – Set all Bits in Register
	 * 
	 * Loads $FF directly to register Rd.
	 * 
	 * @param _Rd
	 */
	ser: function(_Rd) {

		var Rd = this.dataspace[_Rd];

		/* Operation: Rd <- $FF */
		Rd[0] = true;
		Rd[1] = true;
		Rd[2] = true;
		Rd[3] = true;
		Rd[4] = true;
		Rd[5] = true;
		Rd[6] = true;
		Rd[7] = true;

		/* Program counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * SES – Set Signed Flag
	 * 
	 * Sets the Signed Flag (S) in SREG (Status Register).
	 */
	ses: function() {

		/* Operation: S <- 1 */
		SREG[4] = true;

		/* Program counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * SET – Set T Flag
	 * 
	 * Sets the T Flag in SREG (Status Register)
	 */
	set: function() {

		/* Operation: T <- 1 */
		SREG[6] = true;

		/* Program counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * SEV – Set Overflow Flag
	 * 
	 * Sets the Overflow Flag (V) in SREG (Status Register).
	 */
	sev: function() {

		/* Operation: V <- 1 */
		SREG[3] = true;

		/* Program counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * SEZ – Set Zero Flag
	 * 
	 * Sets the Zero Flag (Z) in SREG (Status Register).
	 */
	sez: function() {

		/* Operation: Z <- 1 */
		SREG[1] = true;

		/* Program counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * SLEEP
	 * 
	 * This instruction sets the circuit in sleep mode defined by the MCU Control Register
	 */
	sleep: function() {

		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * SPM – Store Program Memory
	 * 
	 */
	spm: function() {
		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * ST (STD) – Store Indirect From Register to Data Space using Index Z
	 * 
	 */
	st: function() {
		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * STS – Store Direct to Data Space
	 * 
	 * Stores one byte from a Register to the data space. 
	 * For parts with SRAM, the data space consists of the Register File, I/O memory and internal SRAM 
	 * (and external SRAM if applicable).
	 * For parts without SRAM, the data space consists of the Register File only. 
	 * The EEPROM has a separate address space.
	 * 
	 * A 16-bit address must be supplied. 
	 * Memory access is limited to the current data segment of 64K bytes. 
	 * The STS instruction uses the RAMPD Register to access memory above 64K bytes. 
	 * To access another data segment in devices with more than 64K bytes data space,
	 * the RAMPD in register in the I/O area has to be changed.
	 * 
	 * This instruction is not available in all devices. Refer to the device specific instruction set summary
	 * 
	 * @param k      0 <= k <= 65535
	 * @param _Rr    16 <= r <= 31
	 */
	sts: function(k, _Rr) {

		this.memory[k] = this.dataspace[_Rr];

		/* @TODO */

		/* Program Counter: PC <- PC + 2 */
		this.PC += 2;
	},
	/**
	 * SUB – Subtract without Carry
	 * 
	 * Subtracts two registers and places the result in the destination register Rd
	 * 
	 * @param _Rd
	 * @param _Rr
	 */
	sub: function(_Rd, _Rr) {


		var Rd = this.dataspace[_Rd];
		var Rr = this.dataspace[_Rr];
		var C = [false, false, false, false, false, false, false, false];
		var R = [false, false, false, false, false, false, false, false];
		var SREG = this.dataspace[this.sreg];

		/* Operation Rd <- Rd + Rr */
		C[0] = false;

		R[0] = !!(Rd[0] ^ Rr[0]);
		C[1] = !Rd[0] && Rr[0];

		R[1] = !!(Rd[1] ^ Rr[1] ^ C[1]);
		C[2] = C[1] && !!(Rd[1] ^ Rr[1]) || (!Rd[1] && Rr[1]);

		R[2] = !!(Rd[2] ^ Rr[2] ^ C[2]);
		C[3] = C[2] && !!(Rd[2] ^ Rr[2]) || (!Rd[2] && Rr[2]);

		R[3] = !!(Rd[3] ^ Rr[3] ^ C[3]);
		C[4] = C[3] && !!(Rd[3] ^ Rr[3]) || (!Rd[3] && Rr[3]);

		R[4] = !!(Rd[4] ^ Rr[4] ^ C[4]);
		C[5] = C[4] && !!(Rd[4] ^ Rr[4]) || (!Rd[4] && Rr[4]);

		R[5] = !!(Rd[5] ^ Rr[5] ^ C[5]);
		C[6] = C[5] && !!(Rd[5] ^ Rr[5]) || (!Rd[5] && Rr[5]);

		R[6] = !!(Rd[6] ^ Rr[6] ^ C[6]);
		C[7] = C[6] && !!(Rd[6] ^ Rr[6]) || (!Rd[6] && Rr[6]);

		R[7] = !!(Rd[7] ^ Rr[7] ^ C[7]);

		/* C: */
		SREG[0] = C[7] && !!(Rd[7] ^ Rr[7]) || (!Rd[7] && Rr[7]);
		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = R;
	},
	/**
	 * SUBI – Subtract Immediate
	 * 
	 * Subtracts a register and a constant and places the result in the destination register Rd. 
	 * This instruction is working on Register R16 to R31 
	 * and is very well suited for operations on the X, Y and Z-pointers
	 * 
	 * @param _Rd
	 * @param K
	 */
	subi: function(_Rd, K) {

		/* @TODO */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	},
	/**
	 * SWAP – Swap Nibbles
	 * 
	 * Swaps high and low nibbles in a register
	 * 
	 * @param _Rd
	 */
	swap: function(_Rd) {

		var Rd = this.dataspace[_Rd];
		var R = [false, false, false, false, false, false, false, false];

		/* Operation: R(7:4) <- Rd(3:0), R(3:0) <- Rd(7:4) */
		R[7] = Rd[3];
		R[6] = Rd[2];
		R[5] = Rd[1];
		R[4] = Rd[0];

		R[3] = Rd[7];
		R[2] = Rd[6];
		R[1] = Rd[5];
		R[0] = Rd[4];

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = R;
	},
	/**
	 * TST - Test for Zero or Minus
	 * 
	 * Tests if a register is zero or negative. 
	 * Performs a logical AND between a register and itself. 
	 * The register will remain unchanged.
	 * 
	 * @param _Rd
	 */
	tst: function(_Rd) {

		var Rd = this.dataspace[_Rd];
		var SREG = this.dataspace[this.sreg];

		/* Operation: Rd <- Rd && Rd */
		Rd[0] = Rd[0] && Rd[0];
		Rd[1] = Rd[1] && Rd[1];
		Rd[2] = Rd[2] && Rd[2];
		Rd[3] = Rd[3] && Rd[3];
		Rd[4] = Rd[4] && Rd[4];
		Rd[5] = Rd[5] && Rd[5];
		Rd[6] = Rd[6] && Rd[6];
		Rd[7] = Rd[7] && Rd[7];

		/* Z: Set if the result is $00; cleared otherwise. */
		SREG[1] = !Rd[0] && !Rd[1] && !Rd[2] && !Rd[3] && !Rd[4] && !Rd[5] && !Rd[6] && !Rd[7];
		/* N: Set if MSB of the result is set; cleared otherwis. */
		SREG[2] = Rd[7];
		/* V: Cleared */
		SREG[3] = false;
		/* S: N ^ V, For signed tests. */
		SREG[4] = !!(SREG[2] ^ SREG[3]);

		/* Program Counter: PC <- PC + 1 */
		this.PC++;

		this.dataspace[_Rd] = Rd;
	},
	/**
	 * This instruction resets the Watchdog Timer. 
	 * This instruction must be executed within a limited time given by the WD prescaler. 
	 * See the Watchdog Timer hardware specification.
	 */
	wd: function() {
		/* @TODO */

		/* Operation: WD timer restart. */

		/* Program Counter: PC <- PC + 1 */
		this.PC++;
	}
};
