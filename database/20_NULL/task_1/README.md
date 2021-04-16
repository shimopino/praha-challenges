# 課題1

<!-- START doctoc -->
<!-- END doctoc -->

## NULLを含むクエリの演算結果

| query                  | result | 
| ---------------------- | ------ | 
| SELECT TRUE = TRUE;    | 1      | 
| SELECT TRUE = FALSE;   | 0      | 
| SELECT NULL = 0;       | NULL   | 
| SELECT NULL = NULL;    | NULL   | 
| SELECT NULL <> NULL;   | NULL   | 
| SELECT NULL AND TRUE;  | NULL   | 
| SELECT NULL AND FALSE; | 0      | 
| SELECT NULL OR TRUE;   | 1      | 
| SELECT NULL OR FALSE;  | NULL   | 

