// Generated from Jane.g4 by ANTLR 4.13.1
// jshint ignore: start
import antlr4 from 'antlr4';
import JaneVisitor from './JaneVisitor.js';

const serializedATN = [4,1,28,120,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,
4,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,59,8,1,1,2,1,2,1,2,
1,2,1,2,3,2,66,8,2,1,3,1,3,1,3,1,3,1,3,1,3,1,3,3,3,75,8,3,1,3,1,3,1,3,5,
3,80,8,3,10,3,12,3,83,9,3,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,
4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,3,4,110,8,4,1,4,1,
4,1,4,5,4,115,8,4,10,4,12,4,118,9,4,1,4,0,2,6,8,5,0,2,4,6,8,0,2,1,0,19,22,
1,0,1,2,133,0,10,1,0,0,0,2,58,1,0,0,0,4,65,1,0,0,0,6,74,1,0,0,0,8,109,1,
0,0,0,10,11,3,4,2,0,11,12,5,0,0,1,12,1,1,0,0,0,13,14,5,4,0,0,14,15,5,14,
0,0,15,59,3,6,3,0,16,17,3,6,3,0,17,18,5,28,0,0,18,19,3,6,3,0,19,59,1,0,0,
0,20,21,3,6,3,0,21,22,5,28,0,0,22,23,5,4,0,0,23,59,1,0,0,0,24,25,5,9,0,0,
25,26,5,16,0,0,26,27,3,8,4,0,27,28,5,17,0,0,28,29,5,26,0,0,29,30,3,4,2,0,
30,31,5,27,0,0,31,32,5,10,0,0,32,33,5,26,0,0,33,34,3,4,2,0,34,35,5,27,0,
0,35,59,1,0,0,0,36,37,5,11,0,0,37,38,5,16,0,0,38,39,3,8,4,0,39,40,5,17,0,
0,40,41,5,26,0,0,41,42,3,4,2,0,42,43,5,27,0,0,43,59,1,0,0,0,44,45,5,12,0,
0,45,46,5,26,0,0,46,47,3,4,2,0,47,48,5,27,0,0,48,49,5,11,0,0,49,50,5,16,
0,0,50,51,3,8,4,0,51,52,5,17,0,0,52,59,1,0,0,0,53,59,5,8,0,0,54,55,5,16,
0,0,55,56,3,4,2,0,56,57,5,17,0,0,57,59,1,0,0,0,58,13,1,0,0,0,58,16,1,0,0,
0,58,20,1,0,0,0,58,24,1,0,0,0,58,36,1,0,0,0,58,44,1,0,0,0,58,53,1,0,0,0,
58,54,1,0,0,0,59,3,1,0,0,0,60,61,3,2,1,0,61,62,5,13,0,0,62,63,3,4,2,0,63,
66,1,0,0,0,64,66,3,2,1,0,65,60,1,0,0,0,65,64,1,0,0,0,66,5,1,0,0,0,67,68,
6,3,-1,0,68,75,5,5,0,0,69,75,5,4,0,0,70,71,5,16,0,0,71,72,3,6,3,0,72,73,
5,17,0,0,73,75,1,0,0,0,74,67,1,0,0,0,74,69,1,0,0,0,74,70,1,0,0,0,75,81,1,
0,0,0,76,77,10,2,0,0,77,78,7,0,0,0,78,80,3,6,3,3,79,76,1,0,0,0,80,83,1,0,
0,0,81,79,1,0,0,0,81,82,1,0,0,0,82,7,1,0,0,0,83,81,1,0,0,0,84,85,6,4,-1,
0,85,110,5,6,0,0,86,110,5,7,0,0,87,88,3,6,3,0,88,89,5,15,0,0,89,90,3,6,3,
0,90,110,1,0,0,0,91,92,3,6,3,0,92,93,5,23,0,0,93,94,3,6,3,0,94,110,1,0,0,
0,95,96,3,6,3,0,96,97,5,24,0,0,97,98,3,6,3,0,98,110,1,0,0,0,99,100,3,6,3,
0,100,101,7,1,0,0,101,102,3,6,3,0,102,110,1,0,0,0,103,104,5,18,0,0,104,110,
3,8,4,3,105,106,5,16,0,0,106,107,3,8,4,0,107,108,5,17,0,0,108,110,1,0,0,
0,109,84,1,0,0,0,109,86,1,0,0,0,109,87,1,0,0,0,109,91,1,0,0,0,109,95,1,0,
0,0,109,99,1,0,0,0,109,103,1,0,0,0,109,105,1,0,0,0,110,116,1,0,0,0,111,112,
10,2,0,0,112,113,5,25,0,0,113,115,3,8,4,3,114,111,1,0,0,0,115,118,1,0,0,
0,116,114,1,0,0,0,116,117,1,0,0,0,117,9,1,0,0,0,118,116,1,0,0,0,6,58,65,
74,81,109,116];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class JaneParser extends antlr4.Parser {

    static grammarFileName = "Jane.g4";
    static literalNames = [ null, "'>='", "'<='", null, null, null, "'true'", 
                            "'false'", "'skip'", "'if'", "'else'", "'while'", 
                            "'do'", "';'", "':='", "'=='", "'('", "')'", 
                            "'!'", "'*'", "'/'", "'+'", "'-'", "'>'", "'<'", 
                            "'&&'", "'{'", "'}'", "'='" ];
    static symbolicNames = [ null, null, null, "WS", "VAR", "NUMBER", "TRUE", 
                             "FALSE", "SSKIP", "IF", "ELSE", "WHILE", "DO", 
                             "SEMICOLON", "ASSIGN", "SIGN", "LPAREN", "RPAREN", 
                             "EXCLAMATION", "MUL", "DIV", "PLUS", "MINUS", 
                             "RANGLE", "LANGLE", "AND", "LBRACE", "RBRACE", 
                             "EQUAL" ];
    static ruleNames = [ "program", "statement", "statements", "numExpr", 
                         "boolExpr" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = JaneParser.ruleNames;
        this.literalNames = JaneParser.literalNames;
        this.symbolicNames = JaneParser.symbolicNames;
    }

    sempred(localctx, ruleIndex, predIndex) {
    	switch(ruleIndex) {
    	case 3:
    	    		return this.numExpr_sempred(localctx, predIndex);
    	case 4:
    	    		return this.boolExpr_sempred(localctx, predIndex);
        default:
            throw "No predicate with index:" + ruleIndex;
       }
    }

    numExpr_sempred(localctx, predIndex) {
    	switch(predIndex) {
    		case 0:
    			return this.precpred(this._ctx, 2);
    		default:
    			throw "No predicate with index:" + predIndex;
    	}
    };

    boolExpr_sempred(localctx, predIndex) {
    	switch(predIndex) {
    		case 1:
    			return this.precpred(this._ctx, 2);
    		default:
    			throw "No predicate with index:" + predIndex;
    	}
    };




	program() {
	    let localctx = new ProgramContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, JaneParser.RULE_program);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 10;
	        this.statements();
	        this.state = 11;
	        this.match(JaneParser.EOF);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	statement() {
	    let localctx = new StatementContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, JaneParser.RULE_statement);
	    try {
	        this.state = 58;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,0,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 13;
	            this.match(JaneParser.VAR);
	            this.state = 14;
	            this.match(JaneParser.ASSIGN);
	            this.state = 15;
	            this.numExpr(0);
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 16;
	            this.numExpr(0);
	            this.state = 17;
	            this.match(JaneParser.EQUAL);
	            this.state = 18;
	            this.numExpr(0);
	            break;

	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 20;
	            this.numExpr(0);
	            this.state = 21;
	            this.match(JaneParser.EQUAL);
	            this.state = 22;
	            this.match(JaneParser.VAR);
	            break;

	        case 4:
	            this.enterOuterAlt(localctx, 4);
	            this.state = 24;
	            this.match(JaneParser.IF);
	            this.state = 25;
	            this.match(JaneParser.LPAREN);
	            this.state = 26;
	            this.boolExpr(0);
	            this.state = 27;
	            this.match(JaneParser.RPAREN);
	            this.state = 28;
	            this.match(JaneParser.LBRACE);
	            this.state = 29;
	            this.statements();
	            this.state = 30;
	            this.match(JaneParser.RBRACE);
	            this.state = 31;
	            this.match(JaneParser.ELSE);
	            this.state = 32;
	            this.match(JaneParser.LBRACE);
	            this.state = 33;
	            this.statements();
	            this.state = 34;
	            this.match(JaneParser.RBRACE);
	            break;

	        case 5:
	            this.enterOuterAlt(localctx, 5);
	            this.state = 36;
	            this.match(JaneParser.WHILE);
	            this.state = 37;
	            this.match(JaneParser.LPAREN);
	            this.state = 38;
	            this.boolExpr(0);
	            this.state = 39;
	            this.match(JaneParser.RPAREN);
	            this.state = 40;
	            this.match(JaneParser.LBRACE);
	            this.state = 41;
	            this.statements();
	            this.state = 42;
	            this.match(JaneParser.RBRACE);
	            break;

	        case 6:
	            this.enterOuterAlt(localctx, 6);
	            this.state = 44;
	            this.match(JaneParser.DO);
	            this.state = 45;
	            this.match(JaneParser.LBRACE);
	            this.state = 46;
	            this.statements();
	            this.state = 47;
	            this.match(JaneParser.RBRACE);
	            this.state = 48;
	            this.match(JaneParser.WHILE);
	            this.state = 49;
	            this.match(JaneParser.LPAREN);
	            this.state = 50;
	            this.boolExpr(0);
	            this.state = 51;
	            this.match(JaneParser.RPAREN);
	            break;

	        case 7:
	            this.enterOuterAlt(localctx, 7);
	            this.state = 53;
	            this.match(JaneParser.SSKIP);
	            break;

	        case 8:
	            this.enterOuterAlt(localctx, 8);
	            this.state = 54;
	            this.match(JaneParser.LPAREN);
	            this.state = 55;
	            this.statements();
	            this.state = 56;
	            this.match(JaneParser.RPAREN);
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	statements() {
	    let localctx = new StatementsContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, JaneParser.RULE_statements);
	    try {
	        this.state = 65;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 60;
	            this.statement();
	            this.state = 61;
	            this.match(JaneParser.SEMICOLON);
	            this.state = 62;
	            this.statements();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 64;
	            this.statement();
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


	numExpr(_p) {
		if(_p===undefined) {
		    _p = 0;
		}
	    const _parentctx = this._ctx;
	    const _parentState = this.state;
	    let localctx = new NumExprContext(this, this._ctx, _parentState);
	    let _prevctx = localctx;
	    const _startState = 6;
	    this.enterRecursionRule(localctx, 6, JaneParser.RULE_numExpr, _p);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 74;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 5:
	            this.state = 68;
	            this.match(JaneParser.NUMBER);
	            break;
	        case 4:
	            this.state = 69;
	            this.match(JaneParser.VAR);
	            break;
	        case 16:
	            this.state = 70;
	            this.match(JaneParser.LPAREN);
	            this.state = 71;
	            this.numExpr(0);
	            this.state = 72;
	            this.match(JaneParser.RPAREN);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 81;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,3,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                localctx = new NumExprContext(this, _parentctx, _parentState);
	                this.pushNewRecursionContext(localctx, _startState, JaneParser.RULE_numExpr);
	                this.state = 76;
	                if (!( this.precpred(this._ctx, 2))) {
	                    throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
	                }
	                this.state = 77;
	                localctx.op = this._input.LT(1);
	                _la = this._input.LA(1);
	                if(!((((_la) & ~0x1f) === 0 && ((1 << _la) & 7864320) !== 0))) {
	                    localctx.op = this._errHandler.recoverInline(this);
	                }
	                else {
	                	this._errHandler.reportMatch(this);
	                    this.consume();
	                }
	                this.state = 78;
	                this.numExpr(3); 
	            }
	            this.state = 83;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,3,this._ctx);
	        }

	    } catch( error) {
	        if(error instanceof antlr4.error.RecognitionException) {
		        localctx.exception = error;
		        this._errHandler.reportError(this, error);
		        this._errHandler.recover(this, error);
		    } else {
		    	throw error;
		    }
	    } finally {
	        this.unrollRecursionContexts(_parentctx)
	    }
	    return localctx;
	}


	boolExpr(_p) {
		if(_p===undefined) {
		    _p = 0;
		}
	    const _parentctx = this._ctx;
	    const _parentState = this.state;
	    let localctx = new BoolExprContext(this, this._ctx, _parentState);
	    let _prevctx = localctx;
	    const _startState = 8;
	    this.enterRecursionRule(localctx, 8, JaneParser.RULE_boolExpr, _p);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 109;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,4,this._ctx);
	        switch(la_) {
	        case 1:
	            this.state = 85;
	            this.match(JaneParser.TRUE);
	            break;

	        case 2:
	            this.state = 86;
	            this.match(JaneParser.FALSE);
	            break;

	        case 3:
	            this.state = 87;
	            this.numExpr(0);
	            this.state = 88;
	            this.match(JaneParser.SIGN);
	            this.state = 89;
	            this.numExpr(0);
	            break;

	        case 4:
	            this.state = 91;
	            this.numExpr(0);
	            this.state = 92;
	            this.match(JaneParser.RANGLE);
	            this.state = 93;
	            this.numExpr(0);
	            break;

	        case 5:
	            this.state = 95;
	            this.numExpr(0);
	            this.state = 96;
	            this.match(JaneParser.LANGLE);
	            this.state = 97;
	            this.numExpr(0);
	            break;

	        case 6:
	            this.state = 99;
	            this.numExpr(0);
	            this.state = 100;
	            localctx.op = this._input.LT(1);
	            _la = this._input.LA(1);
	            if(!(_la===1 || _la===2)) {
	                localctx.op = this._errHandler.recoverInline(this);
	            }
	            else {
	            	this._errHandler.reportMatch(this);
	                this.consume();
	            }
	            this.state = 101;
	            this.numExpr(0);
	            break;

	        case 7:
	            this.state = 103;
	            this.match(JaneParser.EXCLAMATION);
	            this.state = 104;
	            this.boolExpr(3);
	            break;

	        case 8:
	            this.state = 105;
	            this.match(JaneParser.LPAREN);
	            this.state = 106;
	            this.boolExpr(0);
	            this.state = 107;
	            this.match(JaneParser.RPAREN);
	            break;

	        }
	        this._ctx.stop = this._input.LT(-1);
	        this.state = 116;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,5,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                if(this._parseListeners!==null) {
	                    this.triggerExitRuleEvent();
	                }
	                _prevctx = localctx;
	                localctx = new BoolExprContext(this, _parentctx, _parentState);
	                this.pushNewRecursionContext(localctx, _startState, JaneParser.RULE_boolExpr);
	                this.state = 111;
	                if (!( this.precpred(this._ctx, 2))) {
	                    throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
	                }
	                this.state = 112;
	                this.match(JaneParser.AND);
	                this.state = 113;
	                this.boolExpr(3); 
	            }
	            this.state = 118;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,5,this._ctx);
	        }

	    } catch( error) {
	        if(error instanceof antlr4.error.RecognitionException) {
		        localctx.exception = error;
		        this._errHandler.reportError(this, error);
		        this._errHandler.recover(this, error);
		    } else {
		    	throw error;
		    }
	    } finally {
	        this.unrollRecursionContexts(_parentctx)
	    }
	    return localctx;
	}


}

JaneParser.EOF = antlr4.Token.EOF;
JaneParser.T__0 = 1;
JaneParser.T__1 = 2;
JaneParser.WS = 3;
JaneParser.VAR = 4;
JaneParser.NUMBER = 5;
JaneParser.TRUE = 6;
JaneParser.FALSE = 7;
JaneParser.SSKIP = 8;
JaneParser.IF = 9;
JaneParser.ELSE = 10;
JaneParser.WHILE = 11;
JaneParser.DO = 12;
JaneParser.SEMICOLON = 13;
JaneParser.ASSIGN = 14;
JaneParser.SIGN = 15;
JaneParser.LPAREN = 16;
JaneParser.RPAREN = 17;
JaneParser.EXCLAMATION = 18;
JaneParser.MUL = 19;
JaneParser.DIV = 20;
JaneParser.PLUS = 21;
JaneParser.MINUS = 22;
JaneParser.RANGLE = 23;
JaneParser.LANGLE = 24;
JaneParser.AND = 25;
JaneParser.LBRACE = 26;
JaneParser.RBRACE = 27;
JaneParser.EQUAL = 28;

JaneParser.RULE_program = 0;
JaneParser.RULE_statement = 1;
JaneParser.RULE_statements = 2;
JaneParser.RULE_numExpr = 3;
JaneParser.RULE_boolExpr = 4;

class ProgramContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = JaneParser.RULE_program;
    }

	statements() {
	    return this.getTypedRuleContext(StatementsContext,0);
	};

	EOF() {
	    return this.getToken(JaneParser.EOF, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof JaneVisitor ) {
	        return visitor.visitProgram(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class StatementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = JaneParser.RULE_statement;
    }

	VAR() {
	    return this.getToken(JaneParser.VAR, 0);
	};

	ASSIGN() {
	    return this.getToken(JaneParser.ASSIGN, 0);
	};

	numExpr = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(NumExprContext);
	    } else {
	        return this.getTypedRuleContext(NumExprContext,i);
	    }
	};

	EQUAL() {
	    return this.getToken(JaneParser.EQUAL, 0);
	};

	IF() {
	    return this.getToken(JaneParser.IF, 0);
	};

	LPAREN() {
	    return this.getToken(JaneParser.LPAREN, 0);
	};

	boolExpr() {
	    return this.getTypedRuleContext(BoolExprContext,0);
	};

	RPAREN() {
	    return this.getToken(JaneParser.RPAREN, 0);
	};

	LBRACE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JaneParser.LBRACE);
	    } else {
	        return this.getToken(JaneParser.LBRACE, i);
	    }
	};


	statements = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(StatementsContext);
	    } else {
	        return this.getTypedRuleContext(StatementsContext,i);
	    }
	};

	RBRACE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JaneParser.RBRACE);
	    } else {
	        return this.getToken(JaneParser.RBRACE, i);
	    }
	};


	ELSE() {
	    return this.getToken(JaneParser.ELSE, 0);
	};

	WHILE() {
	    return this.getToken(JaneParser.WHILE, 0);
	};

	DO() {
	    return this.getToken(JaneParser.DO, 0);
	};

	SSKIP() {
	    return this.getToken(JaneParser.SSKIP, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof JaneVisitor ) {
	        return visitor.visitStatement(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class StatementsContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = JaneParser.RULE_statements;
    }

	statement() {
	    return this.getTypedRuleContext(StatementContext,0);
	};

	SEMICOLON() {
	    return this.getToken(JaneParser.SEMICOLON, 0);
	};

	statements() {
	    return this.getTypedRuleContext(StatementsContext,0);
	};

	accept(visitor) {
	    if ( visitor instanceof JaneVisitor ) {
	        return visitor.visitStatements(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class NumExprContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = JaneParser.RULE_numExpr;
        this.op = null;
    }

	NUMBER() {
	    return this.getToken(JaneParser.NUMBER, 0);
	};

	VAR() {
	    return this.getToken(JaneParser.VAR, 0);
	};

	LPAREN() {
	    return this.getToken(JaneParser.LPAREN, 0);
	};

	numExpr = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(NumExprContext);
	    } else {
	        return this.getTypedRuleContext(NumExprContext,i);
	    }
	};

	RPAREN() {
	    return this.getToken(JaneParser.RPAREN, 0);
	};

	MUL() {
	    return this.getToken(JaneParser.MUL, 0);
	};

	DIV() {
	    return this.getToken(JaneParser.DIV, 0);
	};

	PLUS() {
	    return this.getToken(JaneParser.PLUS, 0);
	};

	MINUS() {
	    return this.getToken(JaneParser.MINUS, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof JaneVisitor ) {
	        return visitor.visitNumExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class BoolExprContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = JaneParser.RULE_boolExpr;
        this.op = null;
    }

	TRUE() {
	    return this.getToken(JaneParser.TRUE, 0);
	};

	FALSE() {
	    return this.getToken(JaneParser.FALSE, 0);
	};

	numExpr = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(NumExprContext);
	    } else {
	        return this.getTypedRuleContext(NumExprContext,i);
	    }
	};

	SIGN() {
	    return this.getToken(JaneParser.SIGN, 0);
	};

	RANGLE() {
	    return this.getToken(JaneParser.RANGLE, 0);
	};

	LANGLE() {
	    return this.getToken(JaneParser.LANGLE, 0);
	};

	EXCLAMATION() {
	    return this.getToken(JaneParser.EXCLAMATION, 0);
	};

	boolExpr = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(BoolExprContext);
	    } else {
	        return this.getTypedRuleContext(BoolExprContext,i);
	    }
	};

	LPAREN() {
	    return this.getToken(JaneParser.LPAREN, 0);
	};

	RPAREN() {
	    return this.getToken(JaneParser.RPAREN, 0);
	};

	AND() {
	    return this.getToken(JaneParser.AND, 0);
	};

	accept(visitor) {
	    if ( visitor instanceof JaneVisitor ) {
	        return visitor.visitBoolExpr(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}




JaneParser.ProgramContext = ProgramContext; 
JaneParser.StatementContext = StatementContext; 
JaneParser.StatementsContext = StatementsContext; 
JaneParser.NumExprContext = NumExprContext; 
JaneParser.BoolExprContext = BoolExprContext; 
