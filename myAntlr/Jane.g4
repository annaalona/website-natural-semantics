grammar Jane;

program: statements EOF;

statement:
    VAR ASSIGN numExpr
    | numExpr EQUAL numExpr
    | numExpr EQUAL VAR
//    | statement SEMICOLON statement
//    | IF LPAREN boolExpr RPAREN LBRACE statements RBRACE
    | IF LPAREN boolExpr RPAREN LBRACE statements RBRACE ELSE LBRACE statements RBRACE
    | WHILE LPAREN boolExpr RPAREN LBRACE statements RBRACE
    | DO LBRACE statements RBRACE WHILE LPAREN boolExpr RPAREN
    | SSKIP
    | LPAREN statements RPAREN
    ;

statements:
    statement SEMICOLON statements
    | statement;

numExpr: NUMBER
    | VAR
    | numExpr op=(MUL | DIV | PLUS | MINUS) numExpr
    | LPAREN numExpr RPAREN
    ;

boolExpr: TRUE
    | FALSE
    | numExpr SIGN numExpr
    | numExpr RANGLE numExpr
    | numExpr LANGLE numExpr
    | numExpr op=( '>=' | '<=') numExpr
    | EXCLAMATION boolExpr
    | boolExpr AND boolExpr
    | LPAREN boolExpr RPAREN
    ;

WS: [ \t\r\n]+ -> skip;

VAR: [a-zA-Z]; // це правило підходить для однієї латинської літери
NUMBER: [0-9]+;
TRUE: 'true';
FALSE: 'false';
SSKIP: 'skip';
IF: 'if';
ELSE: 'else';
WHILE: 'while';
DO: 'do';
SEMICOLON: ';';
ASSIGN: ':=';
SIGN: '==';
LPAREN: '(';
RPAREN: ')';
EXCLAMATION: '!';
MUL: '*';
DIV: '/';
PLUS: '+';
MINUS: '-';
RANGLE: '>';
LANGLE: '<';
AND: '&&';
LBRACE: '{';
RBRACE: '}';
EQUAL: '=';
