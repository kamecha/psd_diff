
command! -nargs=1 PsdPrint :call psd_diff#print_psd(bufnr(), <args>)

command! -nargs=* PsdDiff :call psd_diff#diff_psd(<f-args>)

command! -nargs=0 PsdDiffArgs :call psd_diff#diff_psd(argv(argidx()), argv((argidx() + 1) % argc()))
