// Generated from Jane.g4 by ANTLR 4.13.1
// jshint ignore: start
import antlr4 from 'antlr4';
import JaneParser from '../myAntlr/JaneParser.js';

// This class defines a complete generic visitor for a parse tree produced by JaneParser.

export default class JaneVisitor extends antlr4.tree.ParseTreeVisitor {

  visitProgram(ctx) {
    return this.visit(ctx.statements());
  }

  // Visit a parse tree produced by JaneParser#statement.
  visitStatement(ctx) {
    // console.log("Visiting statement...");
    if (ctx.VAR() && ctx.ASSIGN() && ctx.numExpr()) {
      // console.log("Found assignment statement");
      return {
        type: "assignment",
        variable: ctx.VAR().getText(),
        value: this.visit(ctx.numExpr())
      };
    } else if (ctx.numExpr(0) && ctx.EQUAL() && ctx.numExpr(1)) {
      // console.log("Found equality statement");
      return {
        type: "equality",
        left: this.visit(ctx.numExpr(0)),
        right: this.visit(ctx.numExpr(1))
      };
    } else if (ctx.numExpr() && ctx.EQUAL() && ctx.VAR()) {
      // console.log("Found equality statement with variable");
      return {
        type: "equality",
        left: this.visit(ctx.numExpr()),
        right: ctx.VAR().getText()
      };
    } else if (ctx.IF()) {
      // console.log("Found if statement");
      const condition = this.visit(ctx.boolExpr());
      const thenBranch = this.visit(ctx.statements(0));
      const elseBranch = ctx.statements(1) ? this.visit(ctx.statements(1)) : null;
      return {
        type: "if",
        condition: condition,
        thenBranch: thenBranch,
        elseBranch: elseBranch
      };
    } else if (ctx.WHILE()) {
      // console.log("Found while statement");
      return {
        type: "while",
        condition: this.visit(ctx.boolExpr()),
        body: this.visit(ctx.statements())
      };
    } else if (ctx.DO()) {
      // console.log("Found do-while statement");
      return {
        type: "doWhile",
        body: this.visit(ctx.statements()),
        condition: this.visit(ctx.boolExpr())
      };
    } else if (ctx.SSKIP()) {
      // console.log("Found skip statement");
      return { type: "skip" };
    } else if (ctx.LPAREN() && ctx.statements() && ctx.RPAREN()) {
      // console.log("Found parentheses-wrapped statements");
      return this.visit(ctx.statements());
    }
    // console.log("No specific statement type found");
    return null;
  }

  visitStatements(ctx) {
    const statements = [];
    let currentCtx = ctx;

    while (currentCtx) {
      const statementNode = currentCtx.statement();
      const statement = this.visit(statementNode);

      if (statement !== null) {
        if (currentCtx.SEMICOLON()) {
          // Split based on the semicolon
          const semicolonNode = currentCtx.SEMICOLON();
          const left = statement;
          const rightCtx = currentCtx.statements();

          // Create a semicolon node
          const semicolonNodeJSON = {
            type: "semicolon",
            leftSemicolon: left,
            rightSemicolon: rightCtx ? this.visitStatements(rightCtx) : null
          };


          statements.push(semicolonNodeJSON);
          break; // Exit the loop since we've processed the semicolon
        } else {
          // No semicolon, this is the last statement
          statements.push(statement);
          break;
        }
      }

      if (currentCtx.statements()) {
        currentCtx = currentCtx.statements();
      } else {
        break;
      }
    }

    // Handle the case where there are no semicolons
    if (statements.length === 0 && ctx.statement()) {
      const statement = this.visit(ctx.statement());
      if (statement !== null) {
        return { type: "statements", body: [statement] };
      }
    }

    return { type: "statements", body: statements };
  }

  // Visit a parse tree produced by JaneParser#numExpr.
  visitNumExpr(ctx) {
    if (ctx.NUMBER()) {
      return { type: "number", value: Number(ctx.NUMBER().getText()) };
    } else if (ctx.VAR()) {
      return { type: "variable", name: ctx.VAR().getText() };
    } else if (ctx.op) {
      return {
        type: "binary",
        operator: ctx.op.text,
        left: this.visit(ctx.numExpr(0)),
        right: this.visit(ctx.numExpr(1))
      };
    } else if (ctx.LPAREN() && ctx.numExpr() && ctx.RPAREN()) {
      return this.visit(ctx.numExpr());
    }
    return null;
  }

  // Visit a parse tree produced by JaneParser#boolExpr.
  visitBoolExpr(ctx) {
    if (ctx.TRUE()) {
      return { type: "boolean", value: true };
    } else if (ctx.FALSE()) {
      return { type: "boolean", value: false };
    } else if (ctx.numExpr(0) && ctx.SIGN() && ctx.numExpr(1)) {
      return {
        type: "comparison",
        operator: ctx.SIGN().getText(),
        left: this.visit(ctx.numExpr(0)),
        right: this.visit(ctx.numExpr(1))
      };
    } else if (ctx.numExpr(0) && ctx.RANGLE() && ctx.numExpr(1)) {
      return {
        type: "comparison",
        operator: ">",
        left: this.visit(ctx.numExpr(0)),
        right: this.visit(ctx.numExpr(1))
      };
    } else if (ctx.numExpr(0) && ctx.LANGLE() && ctx.numExpr(1)) {
      return {
        type: "comparison",
        operator: "<",
        left: this.visit(ctx.numExpr(0)),
        right: this.visit(ctx.numExpr(1))
      };
    } else if (ctx.numExpr(0) && ctx.op && (ctx.op.text === '>=' || ctx.op.text === '<=')) {
      return {
        type: "comparison",
        operator: ctx.op.text,
        left: this.visit(ctx.numExpr(0)),
        right: this.visit(ctx.numExpr(1))
      };
    } else if (ctx.EXCLAMATION() && ctx.boolExpr()) {
      return {
        type: "negation",
        expression: this.visit(ctx.boolExpr())
      };
    } else if (ctx.boolExpr(0) && ctx.AND() && ctx.boolExpr(1)) {
      return {
        type: "conjunction",
        left: this.visit(ctx.boolExpr(0)),
        right: this.visit(ctx.boolExpr(1))
      };
    } else if (ctx.LPAREN() && ctx.boolExpr() && ctx.RPAREN()) {
      return this.visit(ctx.boolExpr());
    }
    return null;
  }
}


