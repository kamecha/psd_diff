
function psd_diff#print_psd(bufnr, path) abort
	let textPsd = denops#request("psd_diff", "textPsd", [a:path])
	setlocal buftype=nofile
	call deletebufline(a:bufnr, 1, '$')
	for line in textPsd
		call appendbufline(a:bufnr, '$', line)
	endfor
endfunction

function psd_diff#diff_psd(source, dest) abort
	call psd_diff#print_psd(bufnr('%'), a:source)
	diffthis
	vnew
	call psd_diff#print_psd(bufnr('%'), a:dest)
	diffthis
endfunction
