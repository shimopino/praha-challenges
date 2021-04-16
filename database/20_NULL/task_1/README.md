# 課題1

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [NULLを含むクエリの演算結果](#null%E3%82%92%E5%90%AB%E3%82%80%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%AE%E6%BC%94%E7%AE%97%E7%B5%90%E6%9E%9C)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

