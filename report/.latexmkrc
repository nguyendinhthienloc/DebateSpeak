# latexmk configuration for DebateSpeak AI Reports
$pdf_mode = 1; # 1 = use pdflatex
$pdflatex = 'pdflatex -interaction=nonstopmode -synctex=1 %O %S';
$out_dir = 'build';
$clean_ext = 'aux bbl blg fdb_latexmk fls log out synctex.gz toc';
