var atmega328 = {
	
	/** Program counter */
	PC: 0,

	/** Stack pointer */
	SP: 8,
	SPL: 0,
	SPH: 0,

	/** SREG */
	sreg: {
		/** Global interrupt enable */
		'I': false,
		/** Bit Copy Storage */
		'T': false,
		/** Half Carry Flag */
		'H': false,
		/** Sign Bit */
		'S': false,
		/** Two's Complement Overflow Flag */
		'V': false,
		/** Negative Flag */
		'N': false,
		/* Zero flag */
		'Z': false,
		/** CaRry flag */
		'C': false
	},

	/* Register space */
	reg: {
		/*       MSB                                                                   LSB */
		0:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		1:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		2:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		3:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		4:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		5:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		6:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		7:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		8:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		9:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		10: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		11: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		12: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		13: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		14: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		15: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		/*       MSB                                                                   LSB */
		16: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		17: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		18: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		19: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		20: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		21: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		22: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		23: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		24: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		25: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		26: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		27: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		28: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		29: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		30: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		31: {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false}
	},

	stack: {
		0:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		1:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		2:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		3:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		4:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		5:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		6:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
		7:  {7: false, 6: false, 5: false, 4: false, 3: false, 2: false, 1: false, 0: false},
	},

	memory: [],



	/**
	 * Performs the logical AND between the contents of register Rd and register Rr 
	 * and places the result in the destination register Rd.
	 *
	 * @param _Rd    Destination register
	 * @param _Rr
	 */
	 'and': function(_Rd, _Rr) {

		var Rd = this.reg[_Rd];
		var Rr = this.reg[_Rr];

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
		this.sreg['S'];

		/* Cleared */
		this.sreg['V'] = false;

		/* Set if MSB of the result is set; cleared otherwise. */
		this.sreg['N'] = Rd[7];

		/* Set if the result is $00; cleared otherwise. */
		this.sreg['Z'] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];

		/* Program counter */
		this.PC++;


		this.reg[_Rd] = Rd; 
	},



	/**
	 * Performs the logical AND between the contents of register Rd and a constant 
	 * and places the result in the destination register Rd.
	 *
	 * @param _Rd
	 * @param K
	 */
	 'andi': function(_Rd, K) {

		var Rd = this.reg[_Rd];

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
		this.sreg['S'];

		/* Cleared */
		this.sreg['V'] = false;

		/* Set if MSB of the result is set; cleared otherwise. */
		this.sreg['N'] = Rd[7];

		/* Set if the result is $00; cleared otherwise. */
		this.sreg['Z'] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];

		this.PC++;

		this.reg[_Rd] = Rd;
	},
	
	
	
	/** 
	 * Bit clear in SREG
	 */
	'bclr': function(s) {
		
		/* @TODO */
		
		switch(s) {
			case 7:
				this.sreg['I'] = false;
				break;
			case 6:
				this.sreg['T'] = false;
				break;
			case 5:
				this.sreg['H'] = false;
				break;
			case 4:
				this.sreg['S'] = false;
				break;
			case 3:
				this.sreg['V'] = false;
				break;
			case 2:
				this.sreg['N'] = false;
				break;
			case 1:
				this.sreg['Z'] = false;
				break;
			case 0:
				this.sreg['C'] = false;
				break;
		}
		
		this.PC++;
	},



	/**
	 * Clears the Carry Flag (C) in SREG (Status Register).
	 */
	 'clc': function() {

		/* Carry Flag cleared */
		this.sreg['C'] = false; 

		/* Program counter */
		this.PC++;
	},



	/**
	 * Clears the Half Carry Flag (H) in SREG (Status Register). 
	 */
	 'clh': function() {

		/* Half Carry Flag cleared */
		this.sreg['H'] = false; 

		/* Program counter */
		this.PC++;
	},



	/**
	 * Clears the Global Interrupt Flag (I) in SREG (Status Register). 
	 * The interrupts will be immediately disabled. 
	 * No interrupt will be executed after the CLI instruction, 
	 * even if it occurs simultaneously with the CLI instruction.
	 */
	 'cli': function() {

		/* Global Interrupt Flag cleared */
		this.sreg['I'] = false; 

		/* Program counter */
		this.PC++;
	},



	/**
	 * Clears the Negative Flag (N) in SREG (Status Register).
	 */
	 'cln': function() {

		/* Negative Flag cleared */
		this.sreg['N'] = false; 

		/* Program counter */
		this.PC++;
	},



	/**
	 * Clears a register. 
	 * This instruction performs an Exclusive OR between a register and itself. 
	 * This will clear all bits in the register.
	 *
	 * @param _Rd    Destination register
	 */
	 'clr': function(_Rd) {

		var Rd = this.reg[_Rd];

		/* Operation: Rd <- Rd != Rd */
		Rd[0] = Rd[0] != Rd[0];
		Rd[1] = Rd[1] != Rd[1];
		Rd[2] = Rd[2] != Rd[2];
		Rd[3] = Rd[3] != Rd[3];
		Rd[4] = Rd[4] != Rd[4];
		Rd[5] = Rd[5] != Rd[5];
		Rd[6] = Rd[6] != Rd[6];
		Rd[7] = Rd[7] != Rd[7];

		this.sreg['S'] = false;
		this.sreg['V'] = false;
		this.sreg['N'] = false;
		this.sreg['Z'] = true;

		/* Program counter */
		this.PC++;


		this.reg[_Rd] = Rd;
	},



	/**
	 * Clears the Signed Flag (S) in SREG (Status Register). 
	 */
	 'cls': function() {

		/* Signed Flag cleared */
		this.sreg['S'] = false;

		/* Program counter */
		this.PC++;
	},



	/**
	 * Clears the T Flag in SREG (Status Register).
	 */
	 'clt': function() {

		/* T Flag cleared */
		this.sreg['T'] = false;

		this.PC++;
	},



	/**
	 * Clears the Overflow Flag (V) in SREG (Status Register).
	 */
	 'clv': function() {

		/* Overflow Flag cleared */
		this.sreg['V'] = false;

		this.PC++;
	},



	/**
	 * Clears the Zero Flag (Z) in SREG (Status Register). 
	 */
	 'clz': function() {

		/* Zero Flag cleared */
		this.sreg['Z'] = false;

		this.PC++;
	},



	/**
	 * Performs the logical EOR between the contents of register Rd and register Rr
	 * and places the result in the destination register Rd.
	 *
	 * @param _Rd
	 * @param _Rr
	 */
	 'eor': function() {

		var Rd = this.reg[_Rd];
		var Rr = this.reg[_Rr];

		/* Operation: Rd <- Rd != Rr */
		Rd[0] = Rd[0] != Rr[0];
		Rd[1] = Rd[1] != Rr[1];
		Rd[2] = Rd[2] != Rr[2];
		Rd[3] = Rd[3] != Rr[3];
		Rd[4] = Rd[4] != Rr[4];
		Rd[5] = Rd[5] != Rr[5];
		Rd[6] = Rd[6] != Rr[6];
		Rd[7] = Rd[7] != Rr[7]; 

		/* @TODO */
		this.sreg['S'];

		/* Cleared */
		this.sreg['V'] = false;

		/* Set if MSB of the result is set; cleared otherwise. */
		this.sreg['N'] = Rd[7];

		/* Set if the result is $00; cleared otherwise. */
		this.sreg['Z'] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];

		/* Program counter */
		this.PC++;


		this.reg[_Rd] = Rd; 
	},
	
	
 	/**
	 *  Logical Shift Left
	 *  
	 *  Shifts all bits in Rd one place to the left. 
	 *  Bit 0 is cleared. 
	 *  Bit 7 is loaded into the C Flag of the SREG. 
	 *  This operation effectively multiplies signed and unsigned values by two.
	 *  
	 *  @param Rd
	 */
	'lsl': function(_Rd) {
		
		Rd = this.reg[_Rd];
		
		/* Set if, before the shift, the MSB of Rd was set; cleared otherwise. */
		this.sreg['C'] = Rd[7];
		
		/* Operation */
		Rd[7] = Rd[6];
		Rd[6] = Rd[5];
		Rd[5] = Rd[4];
		Rd[4] = Rd[3];
		Rd[3] = Rd[2];
		Rd[2] = Rd[1];
		Rd[1] = Rd[0];
		Rd[0] = false;
		
		this.sreg['H'] = Rd[3];
		/* For signed tests. */
		this.sreg['S'] = !!(this.sreg['N'] ^ this.sreg['V']);
		/* For N and C after the shift. */
		this.sreg['V'] = !!(this.sreg['N'] ^ this.sreg['C']);
		/* Set if MSB of the result is set; cleared otherwise. */
		this.sreg['N'] = Rd[7];
		/* Set if the result is $00; cleared otherwise */
		this.sreg['Z'] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];
		
		/* Program Counter */
		this.PC++;
		
		this.reg[_Rd] = Rd;
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
	'lsr': function(_Rd) {
		
		Rd = this.reg[_Rd];
		
		/* Set if, before the shift, the LSB of Rd was set; cleared otherwise */
		this.sreg['C'] = Rd[0];
		
		/* Operation */
		Rd[0] = Rd[1];
		Rd[1] = Rd[2];
		Rd[2] = Rd[3];
		Rd[3] = Rd[4];
		Rd[4] = Rd[5];
		Rd[5] = Rd[6];
		Rd[6] = Rd[7];
		Rd[7] = false;
		
		/* For signed tests. */
		this.sreg['S'] = !!(this.sreg['N'] ^ this.sreg['V']);
		/* For N and C after the shift. */
		this.sreg['V'] = !!(this.sreg['N'] ^ this.sreg['C']);

		this.sreg['N'] = false;
		/* Set if the result is $00; cleared otherwise */
		this.sreg['Z'] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];
		
		/* Program Counter */
		this.PC++;
		
		this.reg[_Rd] = Rd;
	},



	/**
	 * This instruction makes a copy of one register into another. 
	 * The source register Rr is left unchanged, 
	 * while the destination register Rd is loaded with a copy of Rr.
	 *
	 * @param _Rd
	 * @param _Rr
	 */
	 'mov': function(_Rd, _Rr) {

		var Rd = this.reg[_Rd];
		var Rr = this.reg[_Rr];

		/* Operation: Rd <- Rr */
		Rd[0] = Rr[0];
		Rd[1] = Rr[1];
		Rd[2] = Rr[2];
		Rd[3] = Rr[3];
		Rd[4] = Rr[4];
		Rd[5] = Rr[5];
		Rd[6] = Rr[6];
		Rd[7] = Rr[7];

		this.PC++;


		this.reg[_Rd] = Rd;
	},



	/**
	 * This instruction makes a copy of one register pair into another register pair. 
	 * The source register pair Rr+1:Rr is left unchanged, 
	 * while the destination register pair Rd+1:Rd is loaded with a copy of Rr + 1:Rr.
	 *
	 * @param _Rd
	 * @param _Rr
	 */
	 'movw': function(_Rd, _Rr) {

		var Rd  = this.reg[_Rd];
		var Rd1 = this.reg[_Rd + 1];
		var Rr  = this.reg[_Rr];
		var Rr1 = this.reg[_Rr + 1];

		/* Operation: Rd+1:Rd <- Rr+1:Rr */
		/* @TODO */

	},



	/**
	 * This instruction performs a single cycle No Operation.
	 */
	 'nop': function() {

		/* Incrementing program cointer */
		this.PC++;
	},



	/**
	 * Performs the logical OR between the contents of register Rd and register Rr 
	 * and places the result in the destination register Rd.
	 *
	 * @param _Rd
	 * @param _Rr
	 */
	 'or': function() {

		var Rd = this.reg[_Rd];
		var Rr = this.reg[_Rr];

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
		this.sreg['S'];

		/* Cleared */
		this.sreg['V'] = false;

		/* Set if MSB of the result is set; cleared otherwise. */
		this.sreg['N'] = Rd[7];

		/* Set if the result is $00; cleared otherwise. */
		this.sreg['Z'] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];

		/* Program counter */
		this.PC++;


		this.reg[_Rd] = Rd; 
	},



	/**
	 * Performs the logical OR between the contents of register Rd and a constant 
	 * and places the result in the destination register Rd.
	 *
	 * @param _Rd
	 * @param K
	 */
	 'ori': function(_Rd, K) {

		var Rd = this.reg[_Rd];

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
		this.sreg['S'];

		/* Cleared */
		this.sreg['V'] = false;

		/* Set if MSB of the result is set; cleared otherwise. */
		this.sreg['N'] = Rd[7];

		/* Set if the result is $00; cleared otherwise. */
		this.sreg['Z'] = !Rd[7] && !Rd[6] && !Rd[5] && !Rd[4] && !Rd[3] && !Rd[2] && !Rd[1] && !Rd[0];

		this.PC++;


		this.reg[_Rd] = Rd;
	},



	/**
	 * This instruction loads register Rd with a byte from the STACK. 
	 * The Stack Pointer is pre-incremented by 1 before the POP.
	 *
	 * @param _Rd
	 */
	 'pop': function(_Rd) {

		this.SP++;

		/* Rd <- STACK */
		this.reg[_Rd] = this.stack[this.SP];

		this.PC++;
	},



	/**
	 * This instruction stores the contents of register Rr on the STACK. 
	 * The Stack Pointer is post-decremented by 1 after the PUSH.
	 *
	 * @param _Rr
	 */
	 'push': function(_Rr) {

		/* STACK <- Rr */
		this.stack[this.SP] = this.reg[_Rr];

		this.SP--;

		this.PC++;
	},



	/**
	 * This instruction resets the Watchdog Timer. 
	 * This instruction must be executed within a limited time given by the WD prescaler. 
	 * See the Watchdog Timer hardware specification.
	 */
	 'wd': function() {
		/* @TODO */

		/* Operation: WD timer restart. */

		this.PC++;
	}
};
