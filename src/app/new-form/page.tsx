"use client";

import { useRef, useState } from "react";
import FormBuilder from "@/components/FormBuilder";
import Toolbar from "@/components/toolbar/Toolbar";
import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import FormItem from "@/interfaces/FormItem";

const NewFormPage = () => {
	let debounceRefs = new Map();
	let focusedIndexRef = useRef(0);
	const [formItems, setFormItems] = useState<FormItem[]>([
		{
			id: 0,
			props: {
				description: "",
				required: false,
				title: "",
				type: "title",
				isValid: true,
			},
		},
		{
			id: 1,
			props: {
				items: [
					{
						id: 1,
						parentId: 1,
						value: "bdiEKWiRMEYNvFrxxzrLaptrhlIJpSqmyOFxmKvvFaIWOoQafFiMATrMCIURQMRmjDRvibStdpTfZKdPImFNRRLUVAzzeoqKXAWLYcoUaiWIAuYEVNHfHgGMKmqVotGBEflVEyXFdPWZIBdfUytvRsOEYqKgdjGXwLxfeSVYUJHKeQHYHuvAfiQLVfpmJHnzLPwyQHHXTkFONcgxwMKbnAiBbIEXqZnVwQSUezVnKmeZUfbpuIOCrBecUlAXdQFTKEJAzMYjytKUNHefblTCkzDEoeggeXCJGWbBwgIOhKwA",
					},
					{
						id: 2,
						parentId: 1,
						value: "ypsYrVrKBOvqplvdDmgvEExXuJWIcQeAMMJEmjUVikLWISHxLAxGWZoARuRNRNkiqoleEiCelyDCEsOXEMPvJyGJVFdlgOwCqBJVgcEiYKwMhkqGcmydCpdMPxvRTQNGIaqrGEaPpPzUAStqotOlIAdjlugarDIzUXgrXRXoNXFaeyWnuxxnXVMvmoGFhvDiYppRUFNVNJjeXCuzUZOynMeJWINbZQoSqufdQYKAAvAkAEefibvOyVVzCgZtxMOveYDwrzkQpZMMbqVxgnhluUvQtXfYIsymbUPmLHdYkEnj",
					},
					{
						id: 3,
						parentId: 1,
						value: "vIJibkzFVbzkmiJizaNzGzCyxyWmmBWwfqUWrwtjAeXBLQygIOQwTEOhrhXHmbpPGpWeNDBVXrjnDkjXOvIXBWqEYsIFqzHiXMmxdSfdpNBYyeFTRdAfvuTLGFhkuhCZagdqjOyrZDmExcGCoQITpCyDZQUkvoFPFVaxcPWTURYDkeXVuXFoCHagaTImvJTNwbWUzdxapbAwVzDaTNnzRKveDihhNweMgbDAeLTMQZSJjwJJdMwqUGOiyGbpMcgWwDkrTkQEURhqNdlSTjyJnQfrWqHcXebIOXMBqSwvoeLY",
					},
					{
						id: 4,
						parentId: 1,
						value: "EnOccMfQpWWJUhMftvhUXdZOcDAEvlyPRuiFsYuyxhhviTrxtlnEqQjiMHhkEwYqViyaDDPuySznietJzKtyTBEQESkEpfiUecUlQJwYZjCKrGzolyhxyRLtEzrqjvIKomcwwvcoPQpvLzPuhcbkJtAVrJhsvqRspqzCDMFFoUAHBPJYdRivTXbfqPXEdDIGKsSnwkzLLeWIcpgYQgKeKVfEmpaNIRYsoERehnIuELuTzQbJWamgeYhBjkaFsDiEapWxCLwnbNVqjwybPvXHxxeSuCByWDCoWZQRWhVewSkK",
					},
				],
				required: false,
				title: "qqlQKClMVtbeuZzQmUPQnieLvowcEkabmWsbMktWLlrkdxwJUgorkxsZlNuYWcPimleNHxKIlOwHhaqQsNaUMTFyyGQaXsrhoQWgyBtUxYdbUfgozHmmevyoglROOPFmzQNBzFTeWaaepukiRTpdxlaKgxRvVYzuHVmnARkDIVUOvWMNAZuRZUYPNECtkvjKqocyDMOQnjxTcNiMpVHrZovcOogOLolRnWwlEqBaaJtsqbyKVnAExtaqLmTBAhhLgdpEpnyJdqHBrShupqHClnTTHaCvuWejtjqDoyEEaSdJCPxlJcmKudLWgdTApxcZferPvOTVGbbvTCvwBKkinQvDKggOJhhZGxTzwUktLJAUAgKnKGIhdEYrifrDiNijxOpZpIiFczPhlLrcqCnHyQTIcMbWjRMAwbXzxycQLaiwbuoPfVDMAoeYduCGEdQvPhMvkQOUcLogowgHhigwyjIbLtcreSWKjBcDfFXBbrGnopTYPzJt",
				type: "dropdown",
			},
		},
		{
			id: 2,
			props: {
				items: [
					{
						id: 1,
						parentId: 2,
						value: "eyRKQpdLHQgQpFtuoNGVnsTvaarNQzmNUEyTvZpBKbNnnogwFiwtpYnRnWZCGVXJaviQpfrnGbGCbXSBiyVgbYhXzAoEpnGIKAnMNgWJSBnFuEFSPManvdxHOBjeSOaqQqIygsFDHjgUmjvytiHhZmtTkvPaqLnKNgOzNWxnqsblDDmnZzPGqCyJINZIXqwbSBMSorsWCFkUfMPOCcjZJRLnAaypMDWeUjkWEsgQSQdWPkerfaeSVGuFhytdjMmMiFaIzqGcVLwngqeoZWlDJnWlDrzBOHvuWvXHmxYAdEbd",
					},
				],
				required: false,
				title: "opVnbItPpjiKmasCyrAUKOgruaPeoihlDzLtFjZQYsfKneIVNjyNcRkXoGgtzSpVcRwwZAkgCXnuirutMbwIQYBuZVNeOeOljiykQIKSUXmreTTPVlcLOfDDrGPSAuwkjTBaDzrHgMTDbYJgnXxwwOFKPEHgpWjdhfDpVhjCSWnwQlIyZPpwGsfNEwlgfQEXLqVkKvCTWNiCdXBfzvYXWNOOfmlPHWYBPPNOceOYOsgyCKnWNwJiflbsWkSYKAWYKuppYVZIpjgUInsshYMZNMfhVtULZtaJExnFmYtJVcgkLKkrSvClHELZFzQzvvKGtyxLbKfpTZxGyoLmSlBynUvcmKbVFzzzCuEtgKLAZwSroGjCgCvKvOnDrXImjvYubsNaPKgkOIQQulHdTuFquruJqvuCTsuWxBDhdRDSALaVzwAgyfYgpuHoCLeHhUKCGcAAAAUBJQHOHuAMlyJlEupgCXbQbKybKkTortQtsVQQLvGxuSIj",
				type: "dropdown",
			},
		},
		{
			id: 3,
			props: {
				items: [
					{
						id: 1,
						parentId: 3,
						value: "gtFfdbMBOXEOtBGmsViTwdpXvUtQZKTMqJhMiyorAQBKcnmXlMWCROCHhGFWdRFCFmgnWeUcftaBDqxwuiVrMOSSJHMAVYcHbrkudqZVBRJGWExFNUxBuaxsTqbceVXQPvUZhdqNhcBJaQzFmYZYIVzKdEBkQfNDmZEWvrDCNqhHtIfFOrRayqCrJWMTVVmzOmXfndveprBryLygfGoeSapbIGdWUgIhgvfAzeSrQhCxGFMlzXFrYRLOKswQhaeOemnArFxUBqYUiMmbuAksageboNyyIUThYDyDOMYnBGGC",
					},
					{
						id: 2,
						parentId: 3,
						value: "JRMpLAiaTFLnwaNEmdLsBDcMPVaPyCnHRRTdRXADVsPPeNvwylsTRiPpwRZRipFJtfhltwZMwBAMrSvOcrcNSFubPzLHrpsjreQhAiZDJmiVznPSiVHcxGljIXtVUbBCeoLmvJTRrshQmNcQwNSiYiOeAyMJOiyxmuLgwnFBwmCmKJGLhRRdtfdLeAnHuvcUBUntzJWRcRUWWgHagpzmSNlNhslgaAxiFHhhJJELdOEkcsmcVCyHCrziIubPfJKFztPnlHIKuYcfGaFGpwCiYbMsKVVZMsCSpXqFjBtMOOIm",
					},
					{
						id: 3,
						parentId: 3,
						value: "LNFMnEMvxtPhqltJQZvHsDGlqVwJTXGJNTHXdOMLzLSJtwbNYcfDrFzwWbDHPFuoYmyfAhvTUgEMbdEHqemHtZBrJZDRtlBYSYWuUbLZeEvskzKwfhAALGrcbunyYNZLQQtUaISgMgiiOzOVSnDQLKbhyIjyOmvkQowndMszwOvmApOjqPuQMcXiTvpfsZHecXEgXjEdaiqkzRMkQZzEiYJXXALudrjyZEDBbFEljzVqkcpwTMnQkivIYERkQevbLXhLvFHFkfdgQMTSjgbIshkDQJcjxSYPLGyxkLyWsSEO",
					},
					{
						id: 4,
						parentId: 3,
						value: "YfxbakzoLUtVWJhbygKrUIqbFDNtswCUdWkgWeGUDuKiUVIjmnMFwkAaZaTIrpKWpKCBuEvtCkknPvNPERARanICaVTUVImrZWzYrWDAMkJKoVGLNcdFYMpiZrcUYOanJHOWCWPtwBmdyoDALMsSEwZnZzkCdIkuSDooDXZREoUnwfvLIlmgAyULwVNkGkEiKEmPSmePzxaosRPDgmJXHQZJrPRvXJbLcrNNjqfeUfqLllQXXXjNrHqGEThGLosOonvNgLsysvgjiuDkknmVUXUAjcTANyITKlRcBShmPACp",
					},
					{
						id: 5,
						parentId: 3,
						value: "QhwgIJCSTqGFDIxidLwFSewlSjwwoNqClaJVztprqpsKjuIjPwNkUytXPYmAARcogBJSBPdhUfTwNEBtYDmdUIMgLDzQtVwMrIFWacvKxmXNUuJATkjZWKAyMAYMcqyhCTUXMsQfxrOjZMEfGcRpEJOxRHrmnuEtBWAmnqrLIIUUMjMWZYLyjHdjYQSjIRlOgcLhNVpqFgcbZGYUXHIpldAfXJrtVZiiDAVWZkKaFEFkVqHBddifhQysUcbkNlKegsydoyBRYRZjJRztzAAhHUopwjoyUVFqCYSfIIKujWAU",
					},
					{
						id: 6,
						parentId: 3,
						value: "MhxkcxvRfAYwjKVdJEJqDdmPrzRDUziwCYKxkJZWvHOIVIAGhFAsHlTGWKMIRTGURBezqdVBQXgnglIoTOjzQZbVtFIzjQatkKdDiALtKhVlvoSxbgwvWoUiAXfhyaaWJgOPGzKkCZTDqrPYEODmmcfYfcJjwPYjjTrKxLLGMkFmaJoDdufLZovqfnxmtfANmhpUYYfydCfnCYpZuAKqsmxtfmfGAPLsmAKktwDQBrUnuyJbYFrkQQVHOfrRWjPOXDziNwyqGUedFqmHoqRmMdMfodUtunhxHpzkRxEmstze",
					},
				],
				required: true,
				title: "umUPPwdmhvfmKsbYsEuwkjhTscKFYVroyxmxkTafIjqFkvffADzJyzCFvCkGPrraOuftGnGbmbRWEEAhjrrAPtRQvGKScLrBUAvAJDcuBVIwMUoqPpbNwdfLxIxUjEPlDIZCfioUAjpNDwqoXfzlKBtrdNaYnRTxpyssTPInFTroOEIHbHxRvRLPfabQjTRQoqNncYATccsPzJwzlWCwNwqPISUvTYGQKTmtTeFeIdxjzdMkdmmVIGvguXWzTIdMfalIyrTkASFVYtAjrlsMQWPTIiVtpBSQHtyXkiFMvDyyjmYNMpYZkAgdCtyzMYdJzYQNPzOghwRPqqDjUkBnGqEdyLTDmsSiCZajiExGRXEKamglOikyZPTyQhLAhbEkAiPYIoQvrSeSDzCqfRQUwlggxBcrgrEBXKGSALAZTzniUnPyfVMnYsgNFxrYfYXXZvhxRVwwCqgSLWOXlXafaSeZRspMPLtmxmHxDKFqILPDyKvflHRq",
				type: "dropdown",
			},
		},
		{
			id: 4,
			props: {
				allowMultiple: false,
				items: [
					{
						id: 1,
						parentId: 4,
						value: "OjkNCpGBUMydvFrTEzdvhHntYVwUnhcRXtCBVyivmwNortNcSyyEByknTSXwTQhWJZKSfGmslLUnOAsXyxhtFiItNvRyvXARNXSeoiKIknuQPbQugROTKlAHNDTaHvhVWNQGOmNaaJjxVgvXZxeOfYIgCPjQJzdixknzTlKwZJdgFKQeBOFaQDBxaUGIczYuWluaGmKunBBdRiLOshQqyiSpbmkbRRNAjyUuDXLFZDLUcPbrocRKuyFpiGrkobhyNyzErENtcFTsAcTnFAJpDzPCELlvgTlUmskhOArAdkVD",
					},
					{
						id: 2,
						parentId: 4,
						value: "pOXdcIcBuSdohwjeSIyTHYOdrggUeWJzvuVaHOuQKoPjnnMpAbjpBflJHXccYCEkxEwdJQeafuNOvboNleLfEQhsqPTATKbLgWukefrGefjOAtbhuBssKhfHgMIfWPtMGBwEtbhcXPNHAsNaTgdgLDDFZNVCTBCaziMsORntUhKbUVjgghbahrLxzCVesvfLJyjjSgcyJhfIiPtztrMLnyCHVZdBDSXWJrIDVjcKJBIzibJVhLvBExUwKdfOLlHlgUGbILhNRDHbbLThsyvfnrMFfbUXTCiEHsUvGMVotJqo",
					},
					{
						id: 3,
						parentId: 4,
						value: "smxSfOlXauSpxshjcwXRXNsvCniMWJAlnOWGKqYHobDJZqEDMLMtNzsbDxIHjyzxjslEkzRkUdalacnePsygtsgSyjQweQFpIEPoeMaCUAsebXBUvUSnQAHauBFzCSSCgghgSFDiZsQPDYcReJZHJPYmqGYAQGWpRPPDrrLvYCQxncmoUeqocZLOzvvkZgIUhtIWaZzgSgJZlJymWfjXFFehmqvKRIbSBQwfZAxugCxqzaxTsXKsHQohxDxuwvWRfRYcfyhyBvUGJZZPBtTdvFPlyRZqaIjNmiyahrQlthym",
					},
					{
						id: 4,
						parentId: 4,
						value: "OaeUazBEMUAxCzBqQxxOedjrolRByJdZHQoBSvIhuXUHpFtYtPbrWGggYUeXgpOIPSweDzMPVbxQdhUEwOdnkhrUCwAFiEcFxBUDZqAARcFQbdKUfurCDtGYBRQBFmkremcAkdPRhKsvReJxGeGuuAGBRPhYWKUkYetfihVuoYRRxnusPkiFfJxnBpQupwizkTilujhtbZRYPqmlBmteKyHGZrVMaqXdbFThPwUSTJZbNOwOpxgljxsXtpHUeseChjdWSLSGoRcbVHsRjUXdtFzqKpDCjmVFXTpgLlrYpvjp",
					},
					{
						id: 5,
						parentId: 4,
						value: "uNuvVzRFvYPVeqBTxTzcBcClILSNVECKnmgIDwuqEJamNYMPfYeHjdhGvjRvzFUoXJmuSwTjrnnlzilUMRAVZswiDaiqjPAFrYySdBVdtjsfsfZkmOtWrLRQIVIxTHFjDFJrvPWLuRYCZuDGJvCtdjTyBgjprNmEcdZmdKLbLmMGiFlrMVCHtHXAvyGOFioLpKtPwoWXBwyQiCHyNnkzmUUjqrzNfyFNZjfjhgwWvqpWeMwUEtXhGWsMyrMKpQALXzTqRjeLBWNqZuBVKJAuEDOoogiCVrwJYNIYWmNbmViQ",
					},
					{
						id: 6,
						parentId: 4,
						value: "gXdidkFDGtUQTkvQybDTmgfHmVXdWPJraGLEEJQzVGulvzjoisWbTQtzHbAzLdYGEoNcJtDUrjdyVxHvlJPRHDpjolVoCjwaTUJopQXiyBnHlXNxNLdvRtoZCfPzwAnOqTnXulCxTdzHLefyyfiTXrhEyQwHmMAGoMSDIELDCPeUvGUcAJLpjbVQgvoioyBibKJHPYQEwCTKgwCnkgYmOXVwlhBnTfqxAGnkeUgFGHSavclyXluvDyHRzwHfdOljJwfNGHPIaraYGqcHwGALSWPjtWEEjJSDACSUlOMVDqil",
					},
					{
						id: 7,
						parentId: 4,
						value: "NxQqSTMVYUKKylJZCIJcbqUOlQXkEMwIaQcVngNCwWniMHvzAjMXEvEBUnYgRFdIdnFLLXEPHjXRnMVSvICxMBPnXnIrFVuvEzwuUNFcxoWAbvqqPEoFvjPQSuuxNmVdLkTlYkvhqdJtYpohtNOPSAyGIvOuqmghjZYWcqPULRzXMBBHTCJBRbWmcnVzkCLAaPXXDqKKGdSYgCxIDQowcUFJzVPqZFYtItcprptvbtULPHUQHCzwOJTegrQRmqyomuVMiPCVqmwQbXFPeRrZTDQLLeoBwWfkggjlhcxgaqDD",
					},
					{
						id: 8,
						parentId: 4,
						value: "uSRbKWxeUdjshLgCfjwvfDNmUIshtSFFzWbDfduSgEomOqkGTfqgZhxSAIXxmJMYIESLzFaRTlyJLEQchMHcjetAcKdFTPBImVgyygabdmZeJEvRilArntLuXVhzDTNdGmUVYjYRcuryjSoviPQELyPnFCagqZVjqXukLpPnpArliikzLTqTlBbhEmADHESjiTRRZiEWMZvvAUIKlURsOIwXPitmboNGnkOjToxITQBPaccRHdUHUWoaoLuPVsQJVHujlKqrtfOKxXyGiXfqddFUhtTrmILOnoORTUCvgPtI",
					},
				],
				required: false,
				title: "xybsGMyXVEVdIlDYvqWAvQYduJexxXVXECwpiXlLdgRUfmFSXSYAppaSdzSGuXUukQTwwPlMKfaKNVgPWayiMnbNHZEIOMtBiuKmRmWNnzqMUhGLHzZQxUAzNkDRPdErwoODDktngeRVTEhtbsZxJUIBoqIZnVwIAVBsOuctGSAUynJSJaUYPyhkAuYnXDvTuTDcgXVMiYNmTdujvVntqvlgmCyBCEkoqkUqYUbkESvdiXmFloEIKPnTZGedxZGYiyqxLNgyXVCOWVVfKafRrzhIzNwUSZpuelnFWbTxgQEUlcHtvYseTqdFJefgOdNHoimrGJcugTVqOTedUWkXPCQenLDdzBTFVghYVwkOdoIvbftsCbZUBcOTUnUUiEkQkzEfCAtuBpYKSKJursvaUNFPCfXeNExsSIXkuapzzTHEMTrMPhapENAhrrztztNqrOLrtpZUfOYuEAOlQhSBZyZGoQgmfEbSZIVCvGuATetxqrWuRRHT",
				type: "multiple-choice",
			},
		},
		{
			id: 5,
			props: {
				inputType: "number",
				lengthType: "words",
				minLength: "746",
				maxLength: "",
				placeholder: "HhkQOMdtrFOSxUWdpSCwFqQnQBlGheMNjNZlbMjLvzjcgAdhWY",
				regex: "",
				regexMethod: "contains",
				required: true,
				title: "lzSCNVttTNOyCkZoHqGwWMEEjRHiCNrjWMwUBsOokUOIYKJSLFmcaLdBKOYiRoURgWSHCbLhllBfrsnBfxQqvJRbPpqMZLwvPFwQvjudSMiqMSanrUWUommzSLnvvFpmaOHrXEpLrCQLVAUptwnSgTAtErQZzsDUBxnRRyxJdkEvxYRQblWjVyTnqpLvZUSMKyXZQgzSXBgPIHrPVbYUNgypJcuKZjtKxiIhTYVpayWDYjuBksbQJuZKjyGfGRMfxeUFpNcKWuazyJWojtcrWMGqirLhPgdLJuDcEXlwvdlfRCqKwNUvLrSizGqfJpfrFjcRuCHVtKSghbvHqyRAwBZitQfbFsTBoMgtyOfUgrzVnoBtGxDJsiKUVUcSNpIcDDhAqBjuYjyvxSKBcufQPrnBGzdXBRGqQvcDpJHCMlQxTqQSdIAZzQqITYUdEeToMJShEkfUvSBLvVjXZVIlLiFAjvOsxvATgoJzLFphucGETiXoNlAV",
				type: "text-input",
			},
		},
		{
			id: 6,
			props: {
				min: "0",
				max: "12",
				step: "2",
				required: true,
				title: "izgoxrrnioVwXesgaynpqqZiUWuzLGAWLRhWLfJdKCQBldlQNABvjkBdlNdSYZRUrZcxlNZIrfViZHoccCSYWVWacEYBrWJYKZeywoCWICJyYGSmQLBthjbuoIFIkXUplhHwwQpuFiuWsgkbSQmlPzCFjvwHERWzAAcCWpsplbKWhAQjsbYdsdejslRnatCmQkFiQkkeKOEsYjFBziwXmbdVQUHIZzjoDINrSKsPFqoFBpghdMBDvVHWofdcOxStjkGGkKXclHpCNLwEmYSBhgkuCzXtSIahzyUEWjiHCpWouRofElqRYTWuXSAETBvdqRiSqlkMLsdTfNxxIMvOdGvVQcoYitWinUsHQRutlitZJPRaACNzzMbPxVmFOEzCFvNkucEjeIkjcwoJBrAalVrbTFBYXOcnVNiwAWJjldoGeDGeLUcAXKVLdZctudzbDhzCLPxHDRFGlwBxZinerBVuKbOKURvSZhwfnYDJntoShTtJTCYs",
				type: "range",
			},
		},
		{
			id: 7,
			props: {
				allowMultiple: true,
				items: [
					{
						id: 1,
						parentId: 7,
						value: "QzfCnlaqdJberorkeOgBIvxDRvqmKmWqvGATgiOGPsUZIxPfYpsOTzzZhEsnVNdSscCgBVUYpjmAgasrNsmCtKMEnnMXmpojyaqFhmoZKtYKyoleQdGczilKFafQyExsAVDuGKXzFzIvBdAFDCmSPfjUhTDBjHKdJuRpZisvMNTedgjTjkOasPKKsDjNwqdykPOeERgChKwHCoEEXZaCsKzsZZHNJBDHUvsZRygMtRJroYWsuNPMRcUUIfEYhFPogCfgwkRYftpTUPikElJlOXEvsykZYBbXCJiKqYbiUvGN",
					},
					{
						id: 2,
						parentId: 7,
						value: "KtNZNAdUfgVbEdmcNhoMEvCwXrZOONwkVcyRomZSIJwGvUbXeCbDCrLdQDLsJPgwcXixJhTmSZDjfHYvRxvAHoAnZUgiGzMKvaXFrGwRLusxwLyKYTRXmdQUvtWThsKEhvnQhGVatQAHzhXiuYjqkEaUKGafWsnBIRIByYvDkBWilmnKKDZnFnPVavAsFcaRpiSmDqvdwPGYfmeRzZMdUKzWnJTiTszQCdxfXPBwoGPySBxbiRZRrtaLWEbOhEDVtvglZTncLdGGIcpWFRKFiNKbFUSgXxrMFBNwUffqteZc",
					},
					{
						id: 3,
						parentId: 7,
						value: "hsAcqSxxTOMSOwtOKaumbKRwPzCdMhdqRAYGEfBlNWYMkOIsaXNWrcPeCOMpKQLfETPwIvFoajNZoVJgLfiZxXuqdgJSJEIeSlQDkFujdEHUzcsSVGxBsfptxAfrBkkjVoKFdWUlqkNmFZfenrTOauwmBTAfXqlrqkjUfhNyHdNjIovtswBoIhnsVYGQiBXFgkjmOjGUsPajDfgZQwmdQqTYJlfauWNHcNFkgtKftqEXOiYXLtvIXiNdtNPiPEOrpJrOaKoioxOgHySfHmwAsvivjrpdzoYlBXiTUwcvMRdf",
					},
					{
						id: 4,
						parentId: 7,
						value: "QQHNYehfzvnLmbWwYBnbIyvOnUYcftqapMTKNUVWHdQzKXXcKloBccQnMOuBPTHpmimwYqZFKDDKDDZRwvrjrOwDfPZGCIkWQrbyfUhSQYHQMBdPIwwJvQVCFIjbmwnZVIGPgYKAJMsFDUsBulgJgizpVjxigXTeRwoUINsDifWXBtIzUJmnSyzqPfCFzdgFOxZeMvDKpPBFSVkcftGNniIWOhgHqcQgvtDpZWinlPVflXRYVisNDSXjpROErzFkstaSaaXNivrPufABoyIzlcfPSGLHpNBqtSzHRgyJhDAX",
					},
					{
						id: 5,
						parentId: 7,
						value: "cTsTKpENIcehSymeRGamVfewdmtsjrmAdhOQDZdvWmhCIhKXiKxAQyZVboxbXReZsrcPEgZoVefAgHGpRxhpiyKcqULmcUqvzGZsnXVHlDQViHeJlXYlvohXzseVNaognKFDiYWCLTsizrzDnnlUVByMiNcfAvRebBKuBGlfiFEmpTzByiySDOhslhWnzjfsPoTsMMMRuChNwVDlhSuMKCdGqNswlphAkVvsVKIjeLqXjzANmLUHawEiSbSrNTakIXQSTYQROwEhNocCEUYwMVNCMBNpZdyszvRFiCUrmpDm",
					},
					{
						id: 6,
						parentId: 7,
						value: "tOENKzakrqkfSMOQWAMTYnaTnTDLxfVsjmkYsvHAFvHyypbDZYubIkDbrjfqHFNlFwqLgdtEDoqIJsDgJTsaRQUPHwOUZRsThlhXFtywUKuGAgkPxNswpcjZDDDKznpHOBKwuhceHXJnwgOXRfLDElyVfZfuTSkCqrVqWzPzjjXBmPNReWURiQMIpfCBaUqMRfpelwJgZLehoelmSUlyHctBByOyBlHaMaMpxEwcSHwwwgYkwcUuXOoofQxJOswVPodDJkCzsGBRLrFoCXxGjfReCXLSyVnVJdewHxvoYhTo",
					},
					{
						id: 7,
						parentId: 7,
						value: "YZYRyWdTqxbTqXRaIkkEOisIvgRUitYXonaGWnhLLuPAoDPFWwJDMNXNFQfdtUmSIIPIvVFfWtlUozXDGJYbuPebdJmJlUiMEclTiIySXJCRLNIAgkJIMGpAxXorWzVJHcGRaquwEjBhqlhbQMRqEvCfsdFnGgGrSIQFNCNcMnWsLqwcjHXahuOApPxvIeKxzVjGZpfkscMfpudmdIlqhyOGlfcVMfEKhTQzNCDDATHeYcGFbizBNzRnklCjmmkLirObvStpGPULarTJFLZIDaoJjiukCrfEuXZEFTZJBMIv",
					},
					{
						id: 8,
						parentId: 7,
						value: "NbSFjnsrNPlgPFlOYpFafxvcBifcNjnctSjAYbZMiidyWjANCGQrrUVroSjqMbYhQFbRSmIdLwRynEnqavXCgzAvqlNIbiMjyJtmpeEEOBDjIWqctCuQRIeutMYsSbJJxFDuRVNXoLxYYhsykKfLBKMbDtpuWwhkZXZKMKIWJJQNlDdNLkyDKYHkkvdMBvwOeShWczeOuQOdcoCwMuyUdJzOeKoocCuBHccSTarFZzEUsIPXsYRkzhiHFQuwCFPNSlPVBqshXilDIcXoBrfcdoxwnruCVLnlxNaXTRTlOLXw",
					},
					{
						id: 9,
						parentId: 7,
						value: "DiaiieQKlJBzcOVAvcToixpmbxEAXEzwohNMWoKHXDcHtYGJGTJYgicaiIubiGwvqPuvRdHdPRTVxcKLHbJyCaQJNjvoCLrZNtkjftDRkachrmVBKXdicgcAvzgruzZmoKgRPPgsyVllbTPNDuoxsNWAWqsQuUxFkcLjDOUQROzrZyhaNAVYSwhaepskqyGlgwAcUtIvjsDhzYfTuivcwNxDHFlZToZelRBkjArjtzDskhVzjVSyjUujwvfSmdwGWxLeLSMSCtnHPNDfPMonEnNxxxDakXRcxTitZHMUqkme",
					},
					{
						id: 10,
						parentId: 7,
						value: "nnIJvEJNuesdLQOztRJuLsUufEQyIuepOWVkbQhdfsejypwvgtKkaNdPdTwaxBiAHbInkMMvInCWrCscCywcqVFMIOmsiKkEYdptdxHYQSEiwffElMrhEXkYIOclVYyuasSlQnnJXlxIilCNiGmyeOIdmEBvdugVlATEREcTcvgbEWFbVhUvprtjsBapbYSCnEBOQRPVjUCGlBenbyZdPNJsneIxIMcNOXxKlIvOJfAsDIQVgAUWmtLpGGTdHkqKSOaKXlhVPjSSrtolTqeXVAQqrPStWTgWYnXTGAQjZFNx",
					},
				],
				required: false,
				title: "FIUfaYHLuHTktvPicZrazRZhlkPMoeTtUkkPPMFQBakFZFyGqhCSXGnMBgzEhDEDHmdtRbIIQHjAceitIrQWNDAGOiNDoSUfSeByQkRnbFtsJZOGcotuhZKeiprYBkZwiiYnvmjLwVoQLqGjXDyrrhplkPoeaZQdvoXESgGgCerWtaNTirnuKWoonSvPiYCgfCJjYKMvowIBShczyGSmGPOSmAQNVZcyUncpsYTbrVEPiVHGpTEvWyYpdnJyWMMFlFMHDFLzjnreeNyTyPfuEkVJwllBHsiSYfLuHXVsjBrFdRgNmjdEsBuFtFrVGuxCFMvBxWmciNXvnXCLxfdjXcMQiYsUoVbbpEdtqRxqwgsbbPvbiypxkBQJBrEJcAUyHiNEpHmsTbscOeAnGThqoTHvKcrNPXJUNsaBFikBFufzviipjrZfwRZpAuWGouiGwwhDWveVURslhVaCZdSOyPGJZLYYHRWSfJkbBgDrgYJGpILAytkT",
				type: "multiple-choice",
			},
		},
		{
			id: 8,
			props: {
				allowMultiple: false,
				items: [
					{
						id: 1,
						parentId: 8,
						value: "HCZljnKUjNAuGqlKtzTMdUVLBkNhzjLBUecWzptsXoVtOSmfdVAbSwgDvsgbKXCQQTnYbjTfkviDoMaaoXrDmomfifJOYqDrdNiosIVBzlFqulblEyToFXqoPItGkZEJSsjvwvBMWYwslHBhmCQURGhBWTHPoNQBrgTOgiCjOQBnbqvfaxnoaLKmhubNxJVeMWhzOxcWmMpLVaaPWjUbBaWebBCPFfsnyHqOjjZQfdeavnaxtlYcVsDjuthtaikRascWqPyWprUUBDsHUOkuvSUgCugYLJkmscroBGhswbrQ",
					},
					{
						id: 2,
						parentId: 8,
						value: "IsPOmeUGpFNnOawTFrPnBcgvqSGVzCFXNCwisShNNTzTcOAvQxERdWdlOmsZWJUtdptAWfjzwqMirIBSNoPUuVJJmjiHFpiMBWuloTPKsONYyFMAyTLVNtXTETHxaUWEWIVyBgqIHKOLqQwPUJDlSgOCypBtyhDVYmjNJpMGWEzUJhZawKTakRnItcKViTYoXKqTmhZoLPgLJtaXLiIPeXhuEgyivPeyQjmlbhHTpVjeUxnGyZVczcLTWBxKUPXsUnXLoChkJCviLsAsyjODoWGBvHwmwfgRdQasUvJmRZCt",
					},
					{
						id: 3,
						parentId: 8,
						value: "PTqsJQfKpLPXdZVTqgJkGurxZKoOvhXiBdWuQuxqiDaVzqQZovyfLCiXMTzCiNOAnhQTVnFnkZjRMaoJXFruWLTwiiIZMuzGhCXfKqAGPyMDqWFUSJqKyBEZaFAulMRCFbQkCaxGcTkkstPwlkUPdSEDPmncDKxlwpdNnOmIFNDRaYsDeHYJigYhENkpdnzfYdMBjiivGgoZMLkJMukqrdFCDmaKjUyBVaaeBGHuYjFIIEWLxHIYuYJysPqNApRfyfqBWLAMilAwALjuPlXvEnzQoMIQqjGxIjyjgfLgleDt",
					},
					{
						id: 4,
						parentId: 8,
						value: "XlXyuWPRmwXwuIFyCxVHYxExuyPJnUlNvbMoPVHNgSbgSYRUSytbjzwzUCagIwdYXxBriImsFJwoqnwnjdRDenBaKVKeufQWeuTSIcIoFDwMFbivrVZVrKXXWaZzNCnLLahvxOVVAxnSvIXGZSjzqzwTxfpwkWqanDvOWNvudBYrhgSZFrWDdtCdZulZpkMLzvQFqpPfkNkEwuqJTKBOPSYJJazixvyvtWNHRdDZpDAvgyEftCIiyFcZhBCPZnBgWatzxKQEttwZMVShpXflHRRXIlntMBpvqWpRUiGNtYvp",
					},
					{
						id: 5,
						parentId: 8,
						value: "FMWgKFRGyCpwQawQRamlDlixdQwEIOpMHBpFKMGhiTmzpDuYNrXrrMEUrUSdvOeBofWogyGtWydPIHixUKwiXVkelQWMMVbLlzkOMcMBGFUXoLtqRjyjleDmliYqWrrXthpvqdnnKWawbnmbELrPVEAlcTVxywMnGapEeRoCVDtkkDSnSyIwEXtjZTghXtLQJlwHmIZfntribKkjHwYjqgwOTyIbxVVPlOHyEaiSijTOeriKhYmtSIRjRytMhQbSDjgCQLVsnzDFJjKyKbFjfcoCgENfPQjEvUXJqDxSrrmi",
					},
					{
						id: 6,
						parentId: 8,
						value: "oxWYMOxRTDjTlvXmoTXBFPFqhvRDJrzXaimpJNpfPrRgtoDHQpdHQEZsRcKbWDQbmekZBvYNGvpwRWUblcoVWDZWoJIiQcESBOQjwXWPXBoQKeTkcVYaFjfEaGWIdWtCbLRqpBTbaZXFOoYbZBNnhLGMKZxKpuJWlRltxRtrpBuPggAensEuFbbCxcYuOgIVsCIsAIBvIQUyNpzTeDwReEgonDbfRXsbrNUJIbxspHTTHgclHWCyqLovaMEYXjDOTjefphPvAluoTQcQqGoTbMdeLSXIdmoycLkcsBYwMRJN",
					},
					{
						id: 7,
						parentId: 8,
						value: "BaZaHdzjfKVHTNGWqmvJyCDkHRLzffoLrhSTvQcTsgeBApenxtMjyNYPMIGVMoBsslagvLxEbvNbSKVhAYCpVhotPLzwQcTBtgNaLrquwOwstvTYvMEwqKdhtstqvrgfqIloIsBeYKrYkDMdKltHpKuCSoYJxXUZaYxOGvIhhXyIxaAyIjFAWELVjZKGEzCtxDxXMniEXcAclOjeUwSGMwFgesiiptuKXhnKnGAKqbqnSKgxSlfHbPgdcpmrNPVrxwVZFKooaDaojpUfewElnUfUaNsnKQRupHNvDAzYYqpD",
					},
					{
						id: 8,
						parentId: 8,
						value: "mFQxkWRAEKDriIlRenDRfFyVovjLOJCjeOgoQDERbpQogtalnfRBuIDrddEdewuPOhDGcjQMEFXWlPtVZdHbvmYbclNwhimfgPHcAKAVFFJFXMFhmboDgIKtjWiOwOMeelzysVyKKVEGBhcuiZMyMKASXqjHMcHjuJugObltjiIPflrqhbTreCKUjzotJmPJNjmfEWtuRNGXzhtJsYQWooQiNDtHfqsqyBCiiTbgMOEAMVhTzydWVGbLNPMxeAiwdjyiowqvZtDopbnRvYMFgrdNNSlMVnvPElytKABgIMaW",
					},
					{
						id: 9,
						parentId: 8,
						value: "vITmqEMKjALxleWAiQSKlYPgRUYCGfOlWGpvdYJwrYfJxEMysOSQaGdBhbvVoVaxWhVPISrnBgAAITLFBXgkvXPjfSylLgPKcfvSUXiTEYeUrFumyGjcQCmrblbnliBViIUGrCWtJcrRkEdJeFlhCYPqOqZJYuhyqJCNBQYcphoOAynXnwlErwGcSoVRqTwkzVQVvIzHgEsfanRbCmDxTjbmlAOYYNZTMImPPHXdLyCwwzyEJXBMavMsvFItUFdfRHxfSQmphygztdzFQiRCNHmTeAYKXKXZQMmvYihwPXNb",
					},
				],
				required: false,
				title: "mOTwWCAcTGxtOXRcMCwTOGaIuKBqQhJRcdGIIWXRItlbbUlBHQPGYPydWQKQkNDNzQuOTYvOXJqPmVIEJEjxsWiAKKjkVSxurKBqOGJVXpgQLCjUHfSxHnfLLewVPuFgJuBrcogsuxnXjqDtYlAAShwsdkMpZkkjPpkmcofrGvTLnuceMrKKChDNNFjbVQyiBUTBpBthHGkhehqyyYDEoUbZXcybwaiODyZTnNaWEQfJFBTAwCLEOtMwMfznrHRnsMzUmVBOEUKliCnOcJVRZbgMETaCciwEUHAGHVXsfwGenmugfXewGSbonPdSWekVcOejYlqXDQrdoeDDEXwezDyUQotCDyHxoakDSRPNuPdGxakmAowPwXCvSDIOvoMZYkVRivdNyPTyDGoZkRgKMDshJvIVZaENNVUyKoKajQCMOtxEjJDkgdLQYRMuShIksVXMiFnPcTMPXGtnOEiECdognUnpmRiKpdFWJGTzeyUboChqqeqW",
				type: "multiple-choice",
			},
		},
		{
			id: 9,
			props: {
				min: "4",
				max: "5",
				step: "1",
				required: true,
				title: "PBAHzLVZtKNpwDAtmdNkroOyUXsPLcFLkNcbmOtkSfsswuhuMaklxnzoCuVtcEUoxYsmSlrIUBRrDEBXSnrOBFwTPuEoQdzVFvxsRsmLgXmxGUXinhWbetjonMgHwqXvRrtCQonFaPublPmpsVDTihitZXpZyjiDgjsBfvIKlUBvUPYbmItwyKloWiMxiVhbpSULketATFVitpjxSuidMrAOSxmBZvlxBnJJUhdUpSKqDmJayPUuTGNAxoOkqlxEoAPYkIulSYgELCyzbaKYNWjPOVgETijfJtwCjwGjLsJSFDCVKqVYinFjWGoEPGnpPTYPcdTtjYjQPNytlOVVppfaaFmfFITHqkqnqsvGzIobyFZAAmukUKkQREQyjDgoyGjsShcJTXFYrzcxxeAjHMmIoDKGzuOKkYEpKprCVejpnHbCaFdrQhhRUESTliVaYnhdbLQVSDYUBKzcENSCWVJIfTSpmOPnCGdiAaTJNoIVGQNanAvf",
				type: "range",
			},
		},
		{
			id: 10,
			props: {
				items: [
					{
						id: 1,
						parentId: 10,
						value: "RpWOfBgeVSPbBoVWzkIUofaOdQMdwDJfeszovcyJtshJHRCAksEtVaUZSfGcbbCevDpTNkfXUOiajgbIfXSQPtahIwgviuRNHYrwXXRWvBtVCCxbHOwBzjCiKARRlMHnBMrslQvYPnyoVHScxuTMyZcPmWwUgbxkkTCtAjvElmUKjbhpndrHMDiZfQnYqMrTYsZhdCJuplgbSEKLYCoSYhmeiGElpYQLDcpfVBXXsUosnyTRepLBSnkeDQFigvaEyYpSYhQzyBQSumDLnnJEiFoTnOwvjufHIEjqDWuhpJzt",
					},
					{
						id: 2,
						parentId: 10,
						value: "PVhSBWrrNPvKHNsDJkIQpbHKuINCbDBpBmbZuZiDcQXWGEZigzJlRfQZjCZMgOqzRhxoyiGaMBAQciuWHOEAKTwnyGhcFuANiqXzsqsGqYAXnpZnDzAtMFNtqzRAEmQMgtilNRDKwjQeeWWVGYYNnIGnSKftLnYVEIAtyMQKimYcfCJokyyJOSLywtVaLbvrPSokFtRbUdQFGptTZhDBxWmpTLacVsMEfaoauKYYbTzxxJgcsZSdYwirzYvHMoWKFYMReIHnwiqNGHftkHGEbuNfoBhZCVjmuSKRuZmaHrJm",
					},
					{
						id: 3,
						parentId: 10,
						value: "DOMrqQQmdcUAcAHaNHLhJhbSQHgoyLvKmxKtvrtmAjngHbvavKGiNNHSTJqQjMHYsWjYIBQncZwsTNpmkAXsQrnnOFZDFSXmCEPfnXiQGJDssoVkbPQDRESzEMdPFgdgOzXgVGlWwVOaClozScxjYwCoUcmZwYWzhMYnBVyaJanLhryfavfaWfNYLqMCtBUHuOIJdcwodlBxJagVfMBdtqUprIuCAUcjBALkGleUOYZsQaTveZjMSTzBOsxLqKFRvtaYRzmYzEsHGQaYavnryOXOOddJpzemwrQICBztcVUM",
					},
					{
						id: 4,
						parentId: 10,
						value: "FFmEfLYuocZRgohIeZHKZdjAkEoHHxHwRqaVkgsPSREyiQLNLetDpdrFssPBWCHyPWBqlDBrSfhsQsagyAoGfNkMzhfddUNSiSdwjPwHiYNYeNRjBzfjAyvhRGkWZeBUlepfwqEeDblmQawwOugrkfeDnTcERPBVEmFpcUuXowgpxVlvoQBykExwGUCVzgFewbovVowaYJsKmTyixUFysykXRttqeJaPwyYqdomGyfXeXzkYznSJjUWZWHjiGloxYDNXDJUyIgwmbcnObBKBuXeoFrMFezxdzcIlXcdJPYBc",
					},
					{
						id: 5,
						parentId: 10,
						value: "mPypdNjeLsPMOMlEETAcmeqJwEPTnbGBRMtpfaplFxZMWRnXUegbmiwshouZzaoziPhqfwmSVawfHtQPCSihjUylPKwlCVhINrTuhOLbnsOqRMqtqkIJshcxHFPRwgYkHZBHEblIxuQPmsXiCFRopTuwJAmEgXozfpdXUlivTuIsnOxoPfrqGGGCZnzsKxNaSeXZXWOWKwpTZYDhfJsKgCSCYqsFRaQDFWLeNlCFeXuKmmCGdMumbOLQQZcUsuenPvhfNniAZRWWrmnDaqRFMxfkhXpXrmuxUVhvFMxIcfme",
					},
					{
						id: 6,
						parentId: 10,
						value: "CJkkltlxexVbzZOBvZaguXYjnWEJJDgXwTeqotXWvTkQNoemghACXyLworwfgxMERCsYtCXWmAyFEzSOccPwMpgUnEXGNmuVukuAfiaMVbGiAtSgoCmuxjnDsOYsulqkuqaMTNOfRIpZCRiMHZYxLogFthrrtkDsQULXszWQOeLzxUNZcXvteBgYYbSQzJolsgNHWUpIEApJifVZCWXYARtSZogcxTDtfyCRkKONXntHNfirKUfOAwgGfflSmTDVvybuyJtvEwNFTvvesjkrpDHuyYRFbjvdBErNGSqgWTGV",
					},
					{
						id: 7,
						parentId: 10,
						value: "oeKMuXDCHLdOosbzHfCaEUNNBWxBezybpEqwnnjgVvOEKvmUwuQaeeTxpxLuYAaXlhwBBnttjjOunPsHzgRxtEkzlVUbuMGAJIuwzDbwmlmXCQLocAgZmUEuIWHaOsKCbHQVuHBdjabgVuZzxwnQgoWwvYWhuthcfeXNFMKKUqFZPRsFxOGdNdiPPLQAlHSeTbliLNEEvemNabKtRIKIZIjqNApzvNwSmiONseHpuyETJgKoGwWyvMQSfsXcDNSmDYHMOEYCajJNHxIPVLLOFVXIICFezUGCDWRwEfuaSWGi",
					},
				],
				required: false,
				title: "WOVvlOsVfnUPkLFTEqHpbOPfNaiKUfiMGyFkLYdFQqQgfMkfFDWvxdEmZhVKVLtCJqTDANAvSlAJNdJpKCApSgkZvnonFfYdgcrIqvjtvJsMIwaqpycajNiQEQfjXtmFHaAufqvSVwGNsFncYZvLziQVhLKxCGpPCAuXrkscyKCkFseLcvjatrMlQbhIRshceJuDSVoDUOXgYrJWmdiSiYIupWUsmiSOxbNqERRShmPBjlgafeQIfKwyZXiAMQFgaKVBHMWYqoXtPYEtMgUlHGjjvYTWQmXoOuSsqWhFDwpPBosDkkpGzEGKbJZdUhCiTcIQEPubFIrapPSJJaknQWFbkLZLXJxHGFPvedfMZmAhAoUJMQDXnFTekyHYdmBFEkJpAsAoumleIEpjiBKtMiFAxylJWvsNhhhCzWxqNUfbhJfQmYtYvhpFkaIOhBuhtsPbzpHxFxbVlNyMRKzDuizTGnCuJSMTFNZNFoshoxsLoQCyanwA",
				type: "dropdown",
			},
		},
		{
			id: 11,
			props: {
				min: "5",
				max: "",
				step: "4",
				required: false,
				title: "ZTTMdcbtngahnlKjsjfFUsAcrKBLRUbhtgxiYotgTpRRPdaHDZqqtkSgRGDrFHBWcCiaFnBaZJfQxGBxrLRutnphwDkNnPjgEeXTrESoYDSLHkWgcrOUPCtqxeelJxNCsgJELHKGJXuITdINlNwOPVFYWLepvGYGvqiBuZLUZXxqvgaxKgowRpnMQsDiSaloSEgRQsdbArEVXTmVzvKJXMIpxjzvxsXxiIVLgffWeFROJAaKoiQTJCpEKqKjagKBlozaZyjTlQxqBQppvBLzhLAiIeoSgkDMXyXCYbqCtvrqkMcAGJItxSQWkRtnsAsDzqtNIQWAAkbeIwXZtLtZyZXYpupxMRdRcbwyJTWEjFwpOOdykTDgWOLmFjaqNtDmQGXjkbIdORImTdmwtIFahcQUqPfSjNllWMLIeTbQxiZNiHndSaoOvMiexTUmbFqetgWogFYqyTBSusbhEDUnJwYwPMwpdioAZmzYaEYLArftckYNvMLS",
				type: "range",
			},
		},
		{
			id: 12,
			props: {
				items: [
					{
						id: 1,
						parentId: 12,
						value: "MTZmiHftctdqTLHFimteiMEyhkYacmNrrwGczeVMqAcjTpIByTMmUziVZCCFEskgnAUYRWNOqTakWLzgPqHUqizhxyovXCxsswytteOGceOfCvmWMGsaPvcOhPteCMbOKIFAiZVCOTsfewcenxYaSMpesvvFMQXKVlmXyAuHWBUGGvnAEmFccsJfWujxDcCFcxKbAarcYkqGuKIAFcsrkZJVMyKaeyolpugbiKsJQeQKvHhvDfvJujSsWEmGYqMnBdpXUOOlvlsYvoLzRPzoJPiKQulptnJcnQFTPYnXrTaD",
					},
					{
						id: 2,
						parentId: 12,
						value: "OKXfIgdBkCItcSwSzsIAnfdycfZVGOKTpAGPPQSeuqHFPjDvCXOyexkAvHMvkQdzwxbkbwDVfFVSegRynoBCiluasiYhANTgliswflujhYWdWQFIsjBsahLiKrTSKtuOwWetosvUJUiycUjNqyRnKnBUWWmbBMXkzbOSqHQDHkghYuRVtmSlWcqDneYrQENimINqgYQASdQtFnRiabKrzzIGqVXGUopGvQHejBNBrTTasYesxIeAROyMdmCkCBgOpCVgaRoEkMYBHIjhUArMRRKVWOCvoBqtXhgICuKZAejJ",
					},
					{
						id: 3,
						parentId: 12,
						value: "kzCeQVvEoEwYGvXkBzyUjVaaNkhjIdxRSEUXmtfsusUSsKHPeiNVlxESnOWEmPUkSvDDZDcblMtspRhgANTbTTObWkkMEFwEvBYniOZllNwcURKomeTcafZTqFhmdYDqTjLUrvAsRQchhklNXMeMxInbAgsEKKALlhfQAzuUfKcSsnMgcOpxJYVlMehcfLfAPedwQueuLBcEIhtRoymBerfDZJkPZfafYUQuOaRpKZHxAWoAEtipNQymMeCNzUbLKsLeptaQDcdSkgFtTNcFUfzOElHRyvTjmXtoFqbVJdsl",
					},
					{
						id: 4,
						parentId: 12,
						value: "UHyrOIffwcacusNBsuWpZKvuCVwGFAREpQfTPGBlNeqvzYwCbFASBiMxgfrMUtYQvJmVuKdkfuTKWGzCppsJWHuirGWQJcKOtcDMtQhuDSQszczybgbqRelsjOAeTorgqmOwfTdoxbkGJtaMEMnnHyVuGhpakucpvPyzxvvrnaPYLupAHhktcoZpOyxKspsavXnWrKwusGSqOaoHvhtyCtwNPMRjTRtbkinPVthRpaThHkCNHwACmsbFAOvnpzTHlwFItBZRRBsrRTzoPsikvEcNIuxoncpalrHconusNrYC",
					},
					{
						id: 5,
						parentId: 12,
						value: "dvYCZaeWMtVselGHuiJmzMQsbiBBbiVzaVURGZlESJqGGIWDWJSyBgFsDvlcQVnCKcyRVVILivvWDzxpOnCCWqNuTNPVCTRcbKSUoKcugUnVQkCJlfHEGTneRwmYTNuYerqygmNRFuegKpXYtcKMKuYBMXIipnXKlKzpYIzBzSTtSNbVimYCiEVppiCFMxgqHbGvtsIVTYdTEgpFkVXDsIIdSmmBOqeqRhWIuFKdPTvnSPXJHFkfDaaEXkryrDbppXLMdJJZEXlBlasgHnaWWaRIjJJTTWLdKWNDFKhQnDIk",
					},
					{
						id: 6,
						parentId: 12,
						value: "cPVIqiHSTVzhfcSYWxDvFdbUPNCDIZIKRbJOhBNBygRhzcKfyayiDOpKhhJqgfNOPzZgHuPSfMWPkxxMeHIBVHKCZsEbATWvjGTTWoxCwttQzpgPlQhaRwAGeIVqHiJdHYVsUfxfocCzeYduZKaqBOSUmiPwVhyjDMEhdWsNrxlHhpKCScdrFrzfJjzUayzvnsJwPsheGZkeGPwdPRRAhZnpbedeWrhJmYTKtnPOgCgZekSVaFpKTgUISLoXxJiRgazcnwSasqQAUppFTyOlhgSSZvlmFSAccvLWoAQPIaGx",
					},
					{
						id: 7,
						parentId: 12,
						value: "NuWQnJBWaqdPeolnPyOZeeHqcbRCEtyPNPBYqFCvVweOnxcSESgfdPqvqtNoURZUiTfjRcEQMdZVTYZdESjoNrbOBQsbwtKKlWoKPjZmSVmUCOSAJgwqdHOOkulNlVQrjhRuUWsUGZUrmKwHxzcKWTPrarahIScUGpqQHCEbpGzYXWOVsYkhLIcblmwGfwTsVeIyMogtRjNIPwdplintAlkueqZJTgOviHWbMAYNTgftLGxVIsGqpNvUBTfhliaLJSzNcjEUYmMzcWTpkmHZztSFrnPPScurdtLtEZUnckls",
					},
				],
				required: true,
				title: "LfiDLSrjOCVGAMxXgJUrNcFbYyMxOPddAmPEHBHSAlhjnbJqIoZxwWtbzkGnSSJmFqOFeGjJlpdqhqXdwUNIHhKILmtldGvmsrPpGWnXIeKSkuPDLNLYwjzxCMrniegzjclvUZRMyzQakItRDRzKmqgAbacplwTGyJubfIWpIMgnTwobSRAgRivoosdgxQnzksjQEUEgjdGdEBqgHMVpqsgSIiAHMUHMqtJWKXHAytxbRxRikZeQiurRETkZRmetfRunXazOjjQXgsHPnNzXfRSAVDTGNQEtVBNmPliCEbOwGXcJMdGntROVUJKFlKFeoPTQnQHJZCmNwxKSlDceMhErXyfGkCMQbuetpIVVtqlLXvjaDWRjzmDVXzqEqzTjRKjpVcHNdZXaEfKWKFgJJDfroWcUILIdBkBCTlqFgKLONDlLpoAwdVPCQXFNJUeykwZcdDjfAVRliDKtvimEeGSsBTGHScdStDIWdetZTCieqQdrJYxq",
				type: "dropdown",
			},
		},
		{
			id: 13,
			props: {
				inputType: "short-text",
				lengthType: "characters",
				minLength: "",
				maxLength: "988",
				placeholder: "AmBlhPvbAdNcSPxdiOsJpmYudcqVMcTmIoSxoKULWPjaZNyqXR",
				regex: "",
				regexMethod: "matches",
				required: true,
				title: "WeXzNZijrtgetSOgLPXLrPwvQobjHlCtBrtaFNdEtqXVewftzPsZrABwztsENgqQfIluIDqNcuhqbNVPrRJdtKeNrnPBMWQFkjeXSuGuZSBJwIdSgMCqkZnPUBoHxLdwRNxycATTIKbAZNFMxjjrkdqstVLsclcvsaYpdCnavkNVuZUgVXDBHuWtWPikPUrsZOUHhZuiALPRAjBsMrenTnmyxCtfpCTEklskCBmrKuSZCQykNjgfJSauudBKkaBBLuWhyfXHHKGVlYIMrMADOgPiEGScZRsHUhnGkkWkAdTaugzsmqjmrPtBlaegOwwcRXvbChvWQejzRNpGpazaSddVpzYqtdKkKEAIsKDfOzdOewiFmaydhJGjcJCSfbDWnxeswoAvDWGdLMHmhlTatZjtNOLUSHdQhKAwxNdCkUAHCOmjsivUZlrTuhYuWtdDXDlRVTYGIjjoqPZBCBZGhazKkmryKJRUKqNqFMKvaktqMhcBFaYI",
				type: "text-input",
			},
		},
		{
			id: 14,
			props: {
				min: "4",
				max: "5",
				step: "4",
				required: false,
				title: "PdFGSZSfmBPTSwtpOnKBdCvBhGGvEOmhNVTDegcpdOtDhiNsOHztGgCgKhOJRQEAhevXcBMxBfbjmixgkyPIUvQLPAKoxLgbbHtBzGmoiZdwaBXswJCTQdChOKYCjefNzBujmHWQyyrRptsCQfXjvPeveMDOIiOPTUFQbbyCMHJjcxsgouIGDAZyqXqDzYRWbqGQTxYbjHagwXMYtcEBYNTrvgkwAmvLiOAaWYhIyUaBTsJXszMhsWVERwFkVMnkEKPAnoxYUUotSbGnWzegSOZKFyvLBxVeEyyjneKSwsRAoXIIdqQxCwZszMXKOGMNvDUySftxymQLACxZtZTYUZOIsveMebedeQskmKGdspBlPpDBlsfHEpQzmgPWPVMrYSGprVcucHjLsDGhAPERIhWBiCxbvuDENgeYZrlDGKbsmkvZHNgOMAngqjeyhcbmyLkMOhYFkCgAonHjKPnysGKhVkKcIcsqUceGqWhjbpagBSfRGiuz",
				type: "range",
			},
		},
		{
			id: 15,
			props: {
				items: [],
				required: true,
				title: "vcHVQMMExOEihZEgDyqXasOJPwxwckBKRQBDCkJFHyYYizcLLYwtKvHDkMPoQmAQoEJfhfohoDiQCnfVGLZSrASbGwDOHedAffAGKQSdMtWnGJcskyXuZjNuVJEPEtRJGtyEeNGjvQFcevokxgTCCIyGDwEpcvnwDWJybCEcpQFOljWHkalhhePmedvUyQdNKhbmGEigSFmnlzDKiOUJFGehnkFiSHJukfxXVvPcPvKvBdpHHwdQLjfpaSJDihSVudJIbZySABwOoFqLxOgtmBISRraMLSopBlZgMguvZjNmeFynLXXnVqPCBMPVpDOYUAkSJBPfPqfklDzRVvXYhPchVHRbZLPcswPrdraZSybGJFopgjepGrbDNXebUJaUsmoIloCsIHZDxKfGmKokepNEtPyMmFdOPPQcdMuOJocMlXMmyBNByEELicsHWbifsmNlIfiRrXGwKqTTdlhCqpagHMfMgqzNYDMqUkWosGOfxIEdqytl",
				type: "dropdown",
			},
		},
		{
			id: 16,
			props: {
				allowMultiple: false,
				items: [
					{
						id: 1,
						parentId: 16,
						value: "JZvgqfmyYiRdlbfHWhUbtfzuooLvsZOnWiaysGtzHBZVLgffEBMjALShdmLzBjwUpwajUUvKgwppdiiFvpjCycrSEzGHQGUYlEAiOWXfecVsVHCWcVSUPMWffBEaAFZEIfqVcUnvbhzCyLvvReslOYKFETBjvVlutOyxGWYfDVTSkXlpZZbzkgxozXxpDuAFkXxBkXAToIXVzOFzXUKJNHAVXuLLzACqIHnVRtGjcbNBgMbqenvrIfepAwJeJRMWayDtYOZFOeUqIPJSVxswqgZWFiuzrJPNEjCjhgdWOMwO",
					},
					{
						id: 2,
						parentId: 16,
						value: "DnnHQkZThVcxvioXIjhcVIEpPHQZUPBukIPnbItWiDZoINzaRJkMbcbJQpsdfEsMBVdqAhYhhcZaVNqBHvAqJeWycraTZDZqbWdzprPSPsUDJhgbkSxmETYXHRIinpciIvmgEhRXVJVDJwDgTtjUWndhqWRcEdKFrLZfFvHQLUhDkgGrbYRGmJcEqfuaOOqLicTxzEOfFhnZxviWuSwaEsksmeGjxiKwqWEhAjqEMaiQitVYouhZDdcXidXNvPrrQkUHFDFQovfxkUXLyiwSlVYjWwrZPoQIvVGqlphXZiHo",
					},
					{
						id: 3,
						parentId: 16,
						value: "SOUSkUSmEojmtzZfSyhhvQCHaamNlvoOzcDRuxXoiceBTYvWwqaYjolUGRayQivyjkrVBjblHqnbopzoMtSsGllovhdFDBjTHBsYbzbcqrHNujLgcnkQnlXVdMpoXRliWIqRuwJYHAxZBQNmonDzRlhwZhoDxCCUSEfDEqZKDtvWfFsREaYaYBvEFtYBGsyhfsAqkdlpOvUtEisbNIaSfrOAixdcUUeAsJgjolwEKcqHDdAwrrhTLLaYuLrNxfbcpvTsSQYUSypgiAdweHTBWYTdoAFszgEvGjPyeoLUvaLu",
					},
					{
						id: 4,
						parentId: 16,
						value: "SpBhUAAxJsZAQJuzvmIknGidgwUvdpYOebfqykRKmclyWfxacnsHRQraiXOVFwfYGmlvQFvmPaCUTlJpDtTxDehVPqyoNKydMkaAnYvEwqNMHCtlrjAyVVTfkeQvKjeLpQkJQsbwDPDSBNdZXCNTzQywjheiBdGXCfOLXRDXcCvwljQSdtclAdCdAuONpUjQvRjacymFzglquCarDgTovZWtNhglruRGHrurBrWHfuwAkAVLMsIWscoweYZGEClwVDOKLbCBorXBiHbQBDzVWXoBJTFTZuyOakRRfixIaUvC",
					},
					{
						id: 5,
						parentId: 16,
						value: "bZlbzjClUpRPymUWmSVfjmsMBJDHvIbnqymbEaffVdvVDlRMdjcSIAJyLsxWHzJcEoomcxzWQvairlVYpEnIemZJORHRoFtPWgeXYmVqrharcxtPDkHiGLIKcDGPJEVjjEYfRPEsXGBcgKGpFbOmyKqcZoSwBOfvQIZlvhXCbhAcfdzZFsRiBtTeosjkjFiqVVqlOxJqtvYMGDRUfhQdmJzbQzTSWvTMMIyquxNIQjTmZaXFQDnaBQNlbciaUJAwAKLbJsEQzKKeOcMxXlEJQatvzqKSpQrBWEKPcdFkMzGp",
					},
				],
				required: true,
				title: "RdhcFfbiFTmAetbBAZbsWqUxSsOgMdNwwVtkAYHspjmrBhfHExEXQNdGmjIxlSoKdgTeZDFsOAaEWvUOjAouYgQoEpUjDLzEkakRIIiGhlRKEoOmZxnZTPfuAjidYfPjmQICPFImixdcMPBESEYXQJjDKxuUXKTXIIAYtShEdPbtWsAMwOIWGtWeVHKIJNfZzvNsBgRMJjUuhrNdOWThQNWWiQvZzBIbPCFAutpXUTVrMvxsygSwdHtzuxIFnIAOCeKzLVTbcTSPMwVxXhOkOeMTfMSkwjSeKrKDXlzyOAYQMxziBTMEBOWXnxySDQiIrxCjbJzvtCWYnrarBXiuQREsZRgHZrZpDQtwypFXIdpOSCqlRieiIPmvinOdTMAsUwHTYcJPbaZHSxoWaWnpwFEiwasYdcwIGLiwBNCZvTCTHpaVStXfMvvobcGIpYMiPztORqiAoVFNsuUBQpgTxRyfXYPxKLVaLJPzEQLmUFrLbsUxYbXf",
				type: "multiple-choice",
			},
		},
		{
			id: 17,
			props: {
				min: "",
				max: "1",
				step: "4",
				required: false,
				title: "CBEJrPPOGuFgqLvBNWlPMUmmcfJGGWWjbXiDoVZxtfDkHERZlzfrTwTQECupNsWeRkgSMzYaqMQDDnyrODhVIbpeCXvSiUULbFlTYRLGUXrNvaZTFHGZSdmKOzxvajdmGSWFXRStJmzZLiQTfniBvQTizUaptDTeOPOBlmKWWwyOIXXnHjVCtkqfcqTBlDpVsNDXSEQeINEmGOussptfVktQnOCpuGjRXfwvVUQasLpDSMvVoQGMKIXljISqZiFvzgMfgbhlCxtGwQzTHlJiCJuZoTxWZmnqRqusuoVUAQCRESHoDKsMFjXhQKbJJUVPDqzlMBsaSRLWijPUdMZMPYaEuIlnuyzjhNwtlVbgfpTCJCzZlypuJYUikhzncukIrolqkcTSIvJofHYDlCUOctipstoFVpBhBoAconqoiNomfdiTzAiJFoDMjvCCuqUHPRmhroqVNTFKaCkYIBOZzyHZuecpSNjXBmvrRwUfxvinXmQdBtyW",
				type: "range",
			},
		},
		{
			id: 18,
			props: {
				inputType: "number",
				lengthType: "characters",
				minLength: "",
				maxLength: "1000",
				placeholder: "JScLXzBJKmtaLaIgORxmPeVSqmsDVzvLtFKdBECUOIZtgOnlha",
				regex: "",
				regexMethod: "doesnt-match",
				required: false,
				title: "psGnvddcFLbQlOcnwbVDZXLgaUzCGaolNuUXeGwKQVAKrvAZRbtOuuswmedkHPsSMIpNxEpEWjOTqKLMbbqvJOKSIbUDkxymBOCfUStVODTidEYGHujTRRHbKqYqjcUStXVHJwDIqiwluAPEAwHWkPdvZVTjsDOVZOHTlNdvaTulSehLACdHjibAIhysKTHsAYNRFCNgiFyeUoYyDtxhOrrNeCeLjLPvzFTXXPDQGpjDwDlOuEyThQFSJazMPhtziPMFvqVRqjzLfbMuzvmojUVwPfpAANCmwEZYwtdMVLACjARuhAAJhLpvIOnrXAvmIcysKZEuEqWQEXyOHlzKMoLQbGiNLFGHCTijWEecRcWqgLAhKCeLJkQiVGxJIQXxfLcLWYTBIqdUyrQZClxGcEMKFDToGuVuUjuzPeFoVpklXVtokGzOIiPLGREPzOnSjgJjmvNVxOidiRUEviCJFTDKuvZPuemkgVRxrPBLiKpgqHQiWhDd",
				type: "text-input",
			},
		},
		{
			id: 19,
			props: {
				min: "",
				max: "14",
				step: "1",
				required: true,
				title: "nAIYWKlFYQEdXrPtAYvaXLVVKNNxRLGcYceHfqTrLEHVnCsIYhsJjHUZzKIKLcSkjtFNQsHNuFOdvowJqmClzNQylSutzeJTkLDesDpBUORqXoYuKFALMovqKduqxXcGqOXRfStRbkzZOsxUmVGsgwqzrmZHCUPuvhooWKaFwhDETNMDpzQrETYeIPeHOZdwAPgJxGPCOsgRnxQwWBqaJUeKNqvGtJiaKDGMnoMlTLHRgEJXXIJhqZkczLblQzlxOXCdgtzOpUGIlpsWqDakPankheBNJKhVtnyNJLfvNxnIpNEzrcYfPXuHryjWBGgBXFVouTFBQrONczGGSwFYNHCtYUmrTHeIpLYnOfMluzKvYlyYkdoQqrQHvZrRLWgpoTXcdZtGVZlUyQjVFBMOQtyRQbsNskgqspgpiJXikMIJdGrIrLFNHFOdDMmpuECsMPkCuVabzoIWRmDFLBzYjgFlmysIIIvHcgbFJGSoMVSpBRwmVbMr",
				type: "range",
			},
		},
		{
			id: 20,
			props: {
				allowMultiple: false,
				items: [
					{
						id: 1,
						parentId: 20,
						value: "zthOPSWJHwybfaVlVajjVyvKsmlKFWuFbSSBkYfGBYsIxjIbmxjglzcMijOfOmOaujGWoaZaHvZSmnprCwoLZcNDUBwpIdWWmfYTWeTYHtCflSEXDLpaOUCbNYznNcWgnnQSPCeFyRypMHZPJobpcNOEirtTcDdiyVrxNZSrOpTSTurGeTAPIyxmeUuusBRvPySVguKyJyCWVBUqneYWZraHvkOEiBpGkPHmBKMzEJYczhEquFqwOYITcncfvhhifRTWqGiZltsRKZEXolbSxIInLTfiCEjsjLkVswoNlPBE",
					},
					{
						id: 2,
						parentId: 20,
						value: "SPkdevVbBKlsKlZWCPGwNmOENbvRviWtyIjlOKIhXmsiIaZgvYyRGEpwwhACRQKeoevPeUWZvftCuNSCxGyWRmQIvcioBDrcoqXuBbqZUgWCDgJLukjUfrDRviKWtsCVUVscFgCIBnItaKXPgGOFXtMSZJZGQdJohzAJqpCPMuhrfxVOBoWySjTfxIfdboDQVobEmuMnxZTbhSSJGgoAAdPOQEeDgtYZgwAbWgUIzZixRrsIDqWEBNHLgFlEMBRuvDQTwzCkndNDpaoLLaiwCOXkoMJSzYinoUPOOUTyHVrO",
					},
					{
						id: 3,
						parentId: 20,
						value: "nYATqlQwVuOEYyWgLvLwQFvIVMQUJovqRVVdhpNUkKSxFoPNGTByqmXkGoxSORaQeYgePdDXtPuFngFfhJZKutREPQpKlhoujMSSvroDjPRxrHoWYQmcRfzTIKnmZRcuQFDctbvDYjwbnMDLqbmMdPYscotusQSifPJLclciOtkeRHIjihSECRwiZCyYHGXaSlrZUEezpZPgFbAnZehpLJFzFZslFIjxsWJoYdenghjturYzQXRXjheCkjXTAtikPbuDykPrulYvECcOPUoFMUlfyryNwqnQSZYXGXuTmNcT",
					},
					{
						id: 4,
						parentId: 20,
						value: "ObPLpvrfDOZlHJEmmCbZDoaAXxZqfhurXjZRhifRnFUoSinomKiUBHHatKeqeDXwHphuHasMQsNmtdIyhOoxMUipAObUDzBWNmyHkWENHQdDmSHIgeDxOPndTtYodvkNFJarFiUTpwDYRXZXVGBTyAjJIGgfComgvIWMGcpzGQoSodxklWJrjGordZgiXgoeuHSsKIvwfgNhLkOhlUNgswpZqYlTVtFGgTnFpkFSWwoyMoenGsEEXJzCtkQBHIewYqbcgZqpkebMafIicwIUuaGEzFSSmMPYAcWfPrQLWyjK",
					},
				],
				required: false,
				title: "gEKuyDMhbaOFQMoZIPcCofPjcMROSiWbtOPmRKqzMnCAWpoJtipVkNHTCniJOQOMjxqGUoLfqVskbObGjsZrLMAcrqhLxOoPdSWbpFHploABhDBNWbmOCyvvcZrrXMxgvfZwENcRVsQVIHpbHyGoQqgghEBAPfgQhkapROPGeLJnwGcEKsOIIuzYoRSfbVwdtlWYCRFJnmkAjaaOcONWGmQDhFgtBbzFPmtZGOZsScUEzvGXcENfXsZdbRFZtimFaIayThZdWDFmZoQmVPKQmlNqvUPEyvizlOCRQOnynDhlnGJVlcHqRRppKcysQEfoVVoSgTzYvPqwwVqzLjLQhdNnArtqhOQHHEjxkQwWPEbRbpLHRwmgMSJOUWtfmZBwnvecSWYktXriQNizXxSLuZoWXvHiugzSrsDADrgCKQyghLAtYemLbgbFnuNJjeqckpgwNZymNMeOkCuqCIFwqiLqcHjVqVoyithZkaTaKPsWhtdPBJUA",
				type: "multiple-choice",
			},
		},
		{
			id: 21,
			props: {
				min: "",
				max: "14",
				step: "2",
				required: false,
				title: "pIvWlorBetQEMOIyiDfrnVHROvPsROpBRfzehbTOLJMnnDFfuKEkEvQblrWHbFYnMDqswmQUYfjQjNRSoMxCcMRXcKILQLVIvOvxsHEortLtFTSqGFlTuLzTKXcFnvJWaqZhNDIGiadJbFOZEILRtqZaJfjUGRdrWuYogHmukioDBlSHKvuRaKiWymFkPXURlfPsQuFlfttgrTXfIbmtizGzXzjoHUtDeQgUspxIQDfpjaBnhCoXSnCrRgUAGyEPKjDBwWRdKTGeDRziuwMJtsviefLNhZRZOaDNBBVnmnggjRHscYjoOuaXXTVoReGWJOTNPZMPFpIuLiaBfagMldCEyqUWcQzgPYKUxFpAtPQNXnDUtjWkXWTbmbGnyXowiNLVsCnRHzsflPwlLEHHCkmTkKHsGNYgAElkflvXOhRSuKeRjRQVjEIzIYGrUwfgbkWdqOkUeYEqmIhSEJPigQZmTiZlQWIDJhQdUQeYooTfdbXelWJF",
				type: "range",
			},
		},
		{
			id: 22,
			props: {
				inputType: "long-text",
				lengthType: "words",
				minLength: "",
				maxLength: "",
				placeholder: "vZWPNihdJKQKxKUWGxOAvjGHZKsLPqkKDbRULpGJUAUbwntlmW",
				regex: "",
				regexMethod: "doesnt-contain",
				required: false,
				title: "iuUIwSocIvJZCFTaFIDlOOoKHSdGlaktgvpKsDjzJnJfPAkVVyupbFiElPthuJHozDVOCqjsqRZTVGBCjvfwKTZriTWIvQnAHPoaOjKpJlwYMdoEVzBhrrbjQmwMHRRpAURIUhBdJBxnMzDXONeygrVyXAyqYhYWODxdQSnkKFJEDTXnOgsoBouJUwiStXEiLSfKHVhwYVElWWeeZQxAFNnwXggLWtrBZvfJLfTddDyZTYXHWiUnfXCMwXEURjrgEqJwsCQxpIcWkqoRiMAPdoIcDGgSQwOMPDahSBccHAYOKcCsBiHBDEOGcRqERnMrvFmWnIFPgwbUrWGRbMUHTRKkWURLTaFFhfGOufIQwqyMnrUuQzqHYfcJchfEsnyKzgbOKbULunJAGSTNMWGxnQasBUdgHZZqVzGBuYDssYhAMMLTASyiZkTgqrpwtYpMmeCNSDNNuKQCUbBdenhiqEPABLOiGTploDCteCrpTuzZbPLqkIKB",
				type: "text-input",
			},
		},
		{
			id: 23,
			props: {
				items: [
					{
						id: 1,
						parentId: 23,
						value: "pVQarrJVanwVNwbDIZahmmgwVtwNheHfGUPJipOhTAzbFxyUeVfeKtLaOGGEvPugKlmoWWHtHwPtxmBoxQsWKjlUyPQGhDOGZKqLRaClxeXcBlhjBkkEVyncbANMmqlPONIKnejZPPkjmEAGxHSOaYAceYVsfCctiOjCBPwXjquKkGytCfaXdxZHzimCTFtRPcAElhzcmMTavecYgwGMSINorCQlAikIPscNIRxDWoXIsPcbtTzWDGSTsQEWZBNLzjYbFjiGYKEWvpQlYYyhPQyuDbHGVtdUvdIOfAISdCqT",
					},
					{
						id: 2,
						parentId: 23,
						value: "PKaEFOkDjUzXcufjWfQqogafePZJCrHamGPQzhbEOiBtHXRQUlgrmcvUpJvtwCFqYxcoOhDBVgxhxsFHiyJTQvtSkWUJGPRDZJDGsIbuKDhMteQptPEtplNiqHmtJkgGkVjmrEaImLDRdpiMUykmRlomEysPzZCwejYyqipAQptBXzSDDkZZbDeBjSWjUEAlhtRIgpXEgBTyhYEdNmBmAVLztuamzUiKJEjZRMYjzGMqzQYkoLeUMcZkMHCoRWFGHSPOasOUeCzrhHkOHtOaImKCckwkCrTPovqBUcPVpBhH",
					},
					{
						id: 3,
						parentId: 23,
						value: "bMXmdStJtcuWHncnFgjMtUnbGdHjvyisjhzAbQsJqsgZxsNuAsrKTMzpDIyvnwabzsNxlaUOOKeqiDSoBHILAHfALRPMcaUvGmnZBEVAdnHKLYimHnyVQOLrDgAJYQRCzgFNmTBJxkzoOymycpbzhvKQPzzAAImAJXsFWgHFFdQVzyzfkAGgvAYWoVUTTzsKEDoDtrSgovFNHNgMhNwyqfbKPEhFBAijCgySTtzHTHAPecArIIlFAtinEpMrNboYhYxGauboKEHjLspLFVOXGSsQTkTMvCYjNpUsEDburCrb",
					},
					{
						id: 4,
						parentId: 23,
						value: "tcFjfcMYzPxuPjhpjhbmfGYilDlgNrWTVbitLRrFLnNPlkDnptodTXblcbpBNFRGiwHRsVftwfCPrcgQHuOCjCpfCtEqRByRKrZDmclCeaVldsawNuBUMhRMvNGCgjYFTGvxYjDSSZIcPhtIkPsLvINlQELWAghDrYONvOjjAUyJJvDYiHgEYlQAsNnHvysgzklAzmiiVqZhPpQCqBEHEDxxCYxbmjllyUtAxmRvWGgxlcKWnMmKMBAuMgfJWmvbJezkpNQPgKVbTSZUrfVmHfPrjDZtvcjJLpWgnvcRnUUZ",
					},
					{
						id: 5,
						parentId: 23,
						value: "vidSOUUtwHZuXWMaqFFXDwSYOPjnaWCUBGkKrutGMkwKZViyTdWNCnuafHuoKqKPHUGSwJWjgaBDNabyDdPrwNCAkVUjCdkfnbYTzvZNFXEYymLrGQzHkjOubmuSwyhTzwXExtFjavVFHnOPNngIVSHYIgKmOINWshnEhKTWPPKQGRgZBUoMLBKitkQgaXwjGMfklcSzcJtQGxDVzeOkRbVgvsaVISIowLrkgbmwGyNgzfNfRJCTCemJSRLWpEtukiuZHSysMcSTURHwvzpDFGTCWoVYEvYMDfxEKASjnTTP",
					},
					{
						id: 6,
						parentId: 23,
						value: "GwFlFpSzOULiXvzueRCGuAmYpeGwmbgKWzFZPNyypPBIOpoZoWUWDUoAEyvLLOvlEIqOXjORzZZckmttggEYZiUVwURnepNCXjSYfWDYtiyqpLfiLBvkrjFddZRRrOHpDBlzLqJEZtgrLflOuygPUqHfCaVkOrddvfUIMxokWTupKmwMOcuNXFjSaDKkNcVqJyWcnYkKryLLfXpifmGfLmGfGdegcnwjOPoYKeEjuWgnXtRRAJOygBxPuGrjnKkdvFmwwNhsOVpMqCTDIDgYtwPjYoMnFKWwOdjKbCDjixOM",
					},
				],
				required: false,
				title: "feKfnqdLFAVzPgVaIhhFnyQmlliwMNFSJfIqFfjVAghTTzJWHdtMLuWZCbDUTYOKPubqfrvylVFLpVmxrXtYYzsiyBMHXqENUBVcbQLUuvJpRXxoSCXRBVProNycfzhajnReRDGVkzQbOipfxkSkyZoaSfZKtZnTGJOUfxjgCCRnvqUHoArqRXWStDLPgEIqmGrJpeSyUmmFJijXbzSjGqMDHiHvxkAMeRkvGaGUYJoqBBeUuZDxGZZYDWwfnyrkzRNiBaFXPPaorvHGZqIqDKlDuFwLdNIOReTzXFBxKLMopZGMIBflPWuuZhSBcacJWVHEAhIrOmyFtBUlRqhXOwpwAoxEFZlaEbtNvQixCgkTlgYEVHSqgMMgQepravmNFLgDhjZTvRONAzzzvcvKEWOErDMyNkBGhlKUrejRpXbqvIqzYKnwqjzAwDsNKYGiQfdjiTNCeBbITOvXOzdpeZBeZIkBufnzxHKkLSpXYEkPnduDyPah",
				type: "dropdown",
			},
		},
		{
			id: 24,
			props: {
				inputType: "number",
				lengthType: "characters",
				minLength: "972",
				maxLength: "",
				placeholder: "NsWCqgAaYDMYsGydMCqxpyngCJcHfjRZHHQXbKeyjtrzGMJtHb",
				regex: "",
				regexMethod: "doesnt-match",
				required: true,
				title: "JhfcqFkBRjUwtcSRBcMDyVPXbjgeQafqmtgIZAeWBePCwgFOLIFXUquxZQTmdHJKaBZBeSyLqKMNXvpUvIeRvndVJLcQePtXqnFMCmNsyFDqcQsUrrNIoLUKdCDIjUVpXtjsekDQbtoKFNePrYOYUuoNjmzQNkeFDnGWXwFPqDCKjJXJmqeubpClVgICfguvktSnUQUHSyMbenvgGjYHpYPjRjyETSvsDjpdVOPNEDSBEESggrOLtZxoYFtOfAlomDEXlwopcGkXjcgUFWohulwRcqMufsVuZrCflwjvatfSzOJcSNNKxxbdvxbDGpzAYSCpicBYdzKDcPfsMatnSpyDoINZzEQhQWrGwUFXbxcaeSCdjSGpPIbvJpzkkohzfusssDRRsEynDRaUVegxGvWcsITLReFWONCInXdVrZOUtXttzUoxXgNMUkBpXpLsyTnksbiMSjyAAYLCBIWpqOKuYKPsRsMNAzHriczAyIaSxdVMbkRS",
				type: "text-input",
			},
		},
		{
			id: 25,
			props: {
				inputType: "number",
				lengthType: "characters",
				minLength: "",
				maxLength: "1552",
				placeholder: "aoIGMpmuCXKrLnkclPqzRMvRNAmDygrcUpNVdylWivIUDepzad",
				regex: "",
				regexMethod: "doesnt-match",
				required: true,
				title: "AQjvEfjcQtfqvKaOYcDgVCXQqtJKBfMLipbDWDExrZItUsbHdagzBaYoeQnvLJvYDPGSFdBDDAGJRzdFdUqLkyGiMaETUGapNOSXZBfyiASOAsHcriwAPVhPsGZGTYEGpkNKNTufQfZeEoENBIcgnWyZnuNGIJBYqPSWjHgpwFLwWtZmMpuzEdynIRcxpssByvRcZXYMcHPeKhGhvqkaNlMHkPgDtoflEiQkBIVBwomcNjScoJbbyxJjWfMiaTLZNYsKOCkqftkbRwtcwdfMZACrdeBUdRSgyaexuCkRgpXufRyLeNgeKxLqCYBTcQlvocfDYgevCSIMENvppJnSRjdgTbGXilBmLDgMBPVUCLIhiyogaLjIgymUuHUfbuBJgGjfmleXSxOJYZyYNLbNUeNXxEcVaJFPEiyMwMMVDeqOwwFPKrNpBNgRFJIqACRMSTlXCYevpGFOkWTWicdPyyrdvWRJeKKPYOVDhDpJkcZzwLijEhAN",
				type: "text-input",
			},
		},
		{
			id: 26,
			props: {
				min: "",
				max: "",
				step: "3",
				required: true,
				title: "LQjnEOgxFSZaoFCRBrlKXCFYHkNIhMjLnjIXSHdPnzFEDXGVzomVFNXvvXKUQkgNnhqLgIoRCAsBLRgklTcPPmeRdpgriEaWhXNgDqdZNWorcazupOHLHHfchpcMrdQFdUOVSXwycGmmRdJioDVBrjTaABcJnxRQZMOMrrGeUqaqhdFxdbodIqxoyrQGihncJSsDeoSusmJbjRrPHyUfingNkpMmxXWXqbydfXCThOmpldZiMrwyEhYUAhotlgiBUbvieMrCnnYoFHLUxwpVsnyaBdZNrDmZpHWZHdMvaAKCrqdoVincbzXqXfgzHAtzIyvmAjzPYpamFqNdraufLWrPaYnZiVhFZHRCmTvIteEdHTMOXRtQrjZnvEXVOaQGSVAwnzxbqXMjvHKEDtWmLxwLHMefKKbHqobLwqtZznTdFkYutROUqRKuVQJYyMRUArpqmlNtonNWzPNduKHQorhlqMonjzmwgnhdgqhDVCaKhycRFQAK",
				type: "range",
			},
		},
		{
			id: 27,
			props: {
				items: [
					{
						id: 1,
						parentId: 27,
						value: "XeyFCbbjpUSTENUeEhPVLjwyogfwAkdGbACtekyJUlBjbREHpwqEzfmqpDtPlDQbwSAqyCbuJNLupJPeZvzMOVtmuLjnCRLXuHJpwNZiBgXznDpHmvYKJfEpnkaHWmUuqHiaEZNsLDVuaXvNBZHtkagwfHHnfZNhUngHkMUlNIcuVwRpZkaAmvSGqxOJnmuWndLCFaxZtSqGTOYZxooFOVEVTCNtBJoKZvWQdipyYyhoFZYLgrkwVzVcajdBkpZlrKkNWREcSHVArukLbqtIFNycCrHgOozqpnWlteWNbJnV",
					},
				],
				required: false,
				title: "YllkMUxFilJpYJwSUBkTqZSSLhdRMbJSRZYFsnOQCcysynFZkShvGISglcizpdYfdZWokqntWoOAKGtLPqslQpQjkporlLQfyHsnaryxRAFmUsJfjLgCtFoKiYXIokQbhmsdHoXlIycWXowxndgUpCjRhbTmPEAVmrLyNIjBOwqhATPhHUYIiGmEcngnLznEKCkSZwFNsdtyePVSeKHfuzRDYahfOzNMoCfFkLThHflhhzRpGxAWLkOcVziJxzMffaGxeDchPnkQycpRFcLBkdRrILCMGlAmwmYHhNpCGqvsjosujgPKymoswxnaBfHUZNekdgxgWbHBEgLTWiGBkksciFYGLTHmYSRySicgjnrTSfwKGFSWvOksAnZLMKabiqVywplZEpFDECidytelrGBsFjwBMtwllEoDuRRyciEeVRHffkFueAHofELsQaXsDYCQAqasuYhDlZrMWsVFyZEPYLKTUmVNbQNWQRXQojYJigWOCNOR",
				type: "dropdown",
			},
		},
		{
			id: 28,
			props: {
				allowMultiple: false,
				items: [
					{
						id: 1,
						parentId: 28,
						value: "mvJRiZZcZvXqfUfPdiGbRPvFpyUFMWiMTjAhuVGXyicPpchpIselwvoDjArYTuPDiHLyHHmASPODJBgWUkZlcivInIrRzHSxgZxXiHIryqfWDKGHVknYiDaqyFUArYyXlhSdDoBwpWEChWhbUoapOgLRsOeqNuBSmakPXoXRaJAxRrjeHLsdgyvLiyilSBzAhYkzMuCPxqjCPNKraSGTMzIAXHnAzGfgXFNcCojnMPzmogbsEiQcEyCJibbXllltYubQumamNpkeGGyfTRYjUDOuYsPbzmeyzbWvilyDYFpa",
					},
					{
						id: 2,
						parentId: 28,
						value: "exnSDULzrzEZKcWRFzOuyAfSSkFgFhYrRIjvDNLdKrHTzXUxLjjFkWcOsOTqkSbjLQRPQOQqOFamkDAwkoKkDZpeyqnJthZZFXDyJjQUCWuJChOjjDzlaPMsbBlnkBIKxYuKnXnozcPEfRMfyzUUytoOyCeQPxCnwzjgDhFmdaHHZhuBzXdstsyScrNPEhbQjgxqDMPTvZnEMmyqvOIidObgGCQwpbQASMbcwSmCYpmBZYVpPsInrNKqyQCiQKNbhrQzJxCELOMjESHOcQAHoJtpZSzvUvEMueCjMIImQnQD",
					},
					{
						id: 3,
						parentId: 28,
						value: "UzlYcCvmBPEjANjUwMgPCLRxwjgqCcuZmRlUWXPVhpMjmdBFlcfImTpYyYivOmyGXgOrCuGRTyWZCmBPwGqoyMGkkGEmGXCBJgYpqZZfvzhtGBIqBSIlWWJyMRasQQeNmpOtYFVAVqBrBSMMMpTzRXmqZmZVpKHfYglApDIfbQatfhtBdiSczXWHkdAFbszLmENkdcSYoYeDODTxpOZcBhoUSxSOSAhhmMlfyzHvmygQlzeKcpWkANorwuPOTvXoxFsIBnpqFaMjZjRQCHVUTBZdjTQSBDEWVcQNHOczijrx",
					},
					{
						id: 4,
						parentId: 28,
						value: "LnfSOIVThDtNZnTeEOFomkbbNWIyUsjcAdMzdzURCyXKiVhlBqisHNfFsEcpomrWPxeGVpSuVMznGCDhXDeEbfNTXtmBsVHdnjTiXcSMcnSAarAdppNapaOFOBttfqjKQWKerKjOXzBWLhKEuJjEqiHdWphIOjrmEZHQiZmYcEZdZvwPbqaHQiKTQxaNnLVdLahecSBRDiExlkmWjtgUwSuVwZBgwKFrrthnQXBMNdfYdsLlnnWxxQfFuqEILtMkOtvrfAjDGBuZumnoxAIwhvKWToDoQvTNluJuSisnkDuG",
					},
					{
						id: 5,
						parentId: 28,
						value: "CBdSTOgdavJjHJFoZfMDizNBbDflYUrRxpHMwPhefWBHRUvRpakhtgaWBYLLLJhOHzNsLSDaOhPgyYrXGOFOgxyUPJHFUzEUfnorYFjgTMhDythQEFDhnfOfedXSwGJKNKaxHRaMZfQEapbyxuYZbpShxecWbWAdJGdccfxAEIGvawnIKqZBeMOsJkqxWYprzqAqmMEcCLfXOENpdSGNbIJhdBVNJHOhPAuOUnMuyheUkECubvVYFhCLTOJAfyJLytebNNNJPheMtddFTrllezgPoQMeKGHFfSKlWVFRmSZZ",
					},
					{
						id: 6,
						parentId: 28,
						value: "ZaoyouKjJFxSjyplAApnwoDODkKlFkYCioiNQlxJxkWfdPzsJfNNFeZocnXdUbGEvbmYOfNfnbplKJVsYjeRKPCokAeFKzbWTHfyVQPupHsCsFnUQORCwAhTzZMeFAEEiGwGUdEriohUKhGIvSDlQBzHYahNapRyrfIsVtDrJYYfMKNggxLrgmdjymoqxFkWWbmNlZXKtDIJQFvQBZafTZxXIAHpaWhPOTNHnauVsGAEqqBoQAihQrAhSCOTYcqxgTdewreMMePssWazbWuOqQlpEJGSmFTnWraTGfNLfMhL",
					},
					{
						id: 7,
						parentId: 28,
						value: "OKGfVHxYAcvNWPHVfnFyVFkiNuyOkFdLoQGqMAcDvfKoLpkEgoQSPvxonzIHhzysmzhKxlLNmhZaLbzpIITpPpLDAfcTMApbJZrRupkgmKUyAwtwxMaXcKPMjaFblVveUfhARQqOGIeNbDnDbWpSLRzTUJZeIIzKQsGrifzGxqbKzqjBkoMQNTwUVCMHhHQGtlpBZHvHvyTwMRYlsTlDECYaNFrEukXIgPByyYRlmOyjdEFJEUVLOkTaJXCHcpYDekxenTYnwavmKlGSehcuuNsJFIMjzGqLeuCYCNGkRWIC",
					},
					{
						id: 8,
						parentId: 28,
						value: "ICFsZITHSSsEbBjjhLKnDoocSDCYuWIdOgRnjsEayOPfUesHAhuNBUuonYHifdmSJEnHXFXQgLzTljgYmxBOvLxiHGAAvJOTCXevLwuqHqyAlnpjkeyDigvwEKeWTerAMrmTEvxUWvAlezBTnrsKqDDoxaqDSkYJJdZNVVzQWSfeRviaEiIzxyFHjFgwLpcCTZmhlbwfKhStxBNKoVLujpdygLhCHuShcGcWwnkgvXMrakuQHwKuHBCjPJwjwjQndvKosrYqvnboxOTdqBVhASAqMsTnqUeKDYcaniDRiivz",
					},
				],
				required: false,
				title: "QSavhlEzrCcOgwFnlYwbcPECuOXvwhcKrxDWBlYZPsjJdqYdiUURxOCAlGEyfOoCrDXlUnweRWbgAXHneupdKoTyxUeizXNhwhpuFyurtlehmisnzYhgCeBQVuLJjQGQaKExsRskCMxkKZciONPoZBSNeNkDorPQFkWbRIglXowkkchpTUvLZqjDQHzPKMHAYhQjAiIqWOPBJmieCqjceNBIakIdhlhkgHztqBbRnGombDIUpPMfIHGvTrUVPSusMOnQMfsxHHCXHFtjWMuNMvBHNEqrgSPtqmwnhepVCzCWyYTMMFTwfwyHMXQZCXCWvDBNUomjQDIqmtFXvsSaBJaSQAtPMUXxtyvmYuteXNTJDbqpWpidvVFqMoczzHUxEruNfeRCSxUFBxRAMlhQFDIsXUSHEysKhPjewusueTUIxdkzjdNuxtbaShmZeYhHGUJToWBLqciJhQmASqrZYxSxHlJDxKrLiXpIQWDiDPhbgYSUyOFw",
				type: "multiple-choice",
			},
		},
		{
			id: 29,
			props: {
				min: "",
				max: "",
				step: "2",
				required: true,
				title: "WTVHGELAekHHNmKSubGhKCimiIZikAfWSRPEeuSSOwhcsSvVacTQcYuNpROQkunZxtpapOkNGiEVtNWUTXbENfDkHFvZcdtoxpCVJeeyFvOURiNOVdLGzKcgwURXCeNkrRWytNOmTgxtmgMmCrsCwAwOWecZQSVuVibDOsZhtQvSaMdwWmqdeleAcmkImhaLkOuKtGmidXmIbFfCQkuABsJMBQitgTKhnIWibzIcAoWwOPSTymTQxCTpkffXrfDkseDHybrVVaaSedzSCeuszxLqLttVumeIqvsraiPHDMIivlUVwxGjvwleZIHMDnYmsbRrnRLJhWnENnHpzMvpjLJIlibgskVgmyQhaOGhhwHZrRMKaGKpYDNSHJfdYbFuNsyGsrUEdQPqrUgLOqfEqkRPeNyNoltjTTCJAFxKdNZeKeLEWPFsjxawMxoiZZBFNeMCCwDgYSeKVhttrRjqKpmMpmgBbHFSoXMVARlCrrDOnIHeZWNm",
				type: "range",
			},
		},
		{
			id: 30,
			props: {
				inputType: "number",
				lengthType: "characters",
				minLength: "33",
				maxLength: "1980",
				placeholder: "RiInKOYuRFUZjbGUQMBgCodfOkAqJQUeCRVmcejCLHOiwgwunh",
				regex: "",
				regexMethod: "doesnt-match",
				required: false,
				title: "NXbvBnIEoWmLhtKVwqScBgaiZDhGXoTZteqIyLXkqMdSdBAMijHSYHpgPUUYAPkvudRsuHxVEFFYNUjIdJTiMujEVCYBmUJOYTmjWmyxNnpxzhzGAruiEWnEFeOtZhJJfGsTMaUIPZVYMUMizTRNgStowISeYMATyKHrdiYEOHkcYpcrxgJeawMafeZmZVWUdvkJaCdDkwWyLKWoBGkgkPanIugxIJMrtJCPvwApuufLzXMdCZKgPqDnjWvJpWhiRsjfqXZBqNKqVmuCHwvuOlfPpNNeNJVWoemzPZofyZalejZhjnVMdNjOEEsTqvYwVwqCDtyVvGziumyQcOhdNIGLcitsVPnwBAcBQTfcPwjuEmZzsCxlkPXmUgBEYmFZfQjoAslDvIunrhYOhxugRSgDNoLHpXKnUJqPrQFXqcQfCcXTCAbTKOqUWvpeWcLkbrbqsuDnfWepyZSWSFkWMEwyYRbTsWRUvKRaWhRroDoFpLbRqhZH",
				type: "text-input",
			},
		},
		{
			id: 31,
			props: {
				inputType: "email",
				lengthType: "characters",
				minLength: "249",
				maxLength: "",
				placeholder: "hwpwMMDRhBseJRjVaifsZkdhTcsgPOOVeZWoLkoeSQUrcHOvXM",
				regex: "",
				regexMethod: "matches",
				required: true,
				title: "zlCpShQrRVkPbnJyBvuApIzwnjzEmkiLLlXTZpdxFMWxlOOOiGEojezzUZvbYxYqfTOZqdyCIqXsBQJlbSaOzbtTGAKASPsjtChoVRbLpIcdfCLnhOxgxpOtFJjmbRYvoKLazvvjbyaszeYHWUsEylyMwDqBEaMKUwojvIALbdNgrGxKBdGxfOoTiTCNLIpqjaJRRZmiFfDdNBCzvHoftKdKUbbxXKNPUDcnfzftsqOLsGlNkZfXoKuJQJqjlLjvsZgCbTzzPavsKUCYwqONHzqvJrPVVxfWmIoZQWckVfPeBXidddAkHBziRjbgWoYzEyxMvEzrdSdmnhxAqQofYzPVFuzxLLfbafFnKxHUSjwHqIciAkTSOMRiQOBzPsaceoplMWxxnOgPYusFuiskoVQcEAjfTVnwymytGGCqpBbJZqhGiVVOkjDJVTysnxoiMEGnjPuKoCpwVhUQBiFZdgxNxeHwALCdjEHUxUavjFJEFwCTLavw",
				type: "text-input",
			},
		},
		{
			id: 32,
			props: {
				items: [
					{
						id: 1,
						parentId: 32,
						value: "EQDIfLshCnrKlkjVSSHROINYuSlPgdNvKNLvYNhjKddjcmghHlBpruKImmfAiBbNgALcNnpQuqtrXoIXUqhvlQSDpTbAOREcCxSNLKjfFyvzKPBzVYlhdweHSHxqaUZtcKIbMIAkFCcEkxCxspsuqRkbKMYvdadrJLTuiLtpxmZhhAWYdMrhcJtYTOowwVzPjjfUECKnVPggatTjkQiLDhZfowAwIOmuLQzAMJyhPWADJyTEoWOEVLpRpNUcuocOUXAvUTcSircMRtFEgyBZAllrHbfdtgHzNrYNCsHwSStZ",
					},
					{
						id: 2,
						parentId: 32,
						value: "xHdNIbOulMhOaPAUzmXvfVJIMmUNLajNtOUsaPnfeKHMZuXvPbhFuqHgpBGMopbISXJnqYBvGjcRXfCnSffiZEZGnuJjaFEaeBofbjghawWsKNbjMERyCWqYYyHzUrmiCEdPaKKqHzfhETtOqULFtFBxxulWbwWGtCplBSQcseVhmyszEouxLMtFoBvhmtXFKcnNsRzLEkTkAXRqGuIQUeglwgMYwXDnbJhebkZxofEcabigAagkWYcKgWLPplBLfUlZEEBNvXRwmZcHJUAVVCYrjICVYDnNJGzdFypSLZQb",
					},
					{
						id: 3,
						parentId: 32,
						value: "NcadAvxwbbEUZuccUedRvUFUhgahLSqjpZwxLImcXRZzREroSpwbjlcjmqfDtKCjgAtRiSWnXPswxtNAvHdwXpaoopWXPOBDcgjLFctTpMAKrrsPrbJpPpkuIoNcJtWxnGZAczpjnhzXKyMqOvSEmEYpoBiyekkPqryrITicpTQOYfVKUbhTGfEYbgvwBoApcfjKdnkNCnEcfYYzPBZGXppCFxczuggmCCttDlWwOpmqzmxrpRdSPlOLsbuQbHsYBuPnMUFEjNZidTACyHICNekNzkbGulotpXJzHNUIDtUZ",
					},
				],
				required: true,
				title: "dglKkwXLSufCXnGNMvuMXjsuzmvlryGhluHqwvQbmYieOqpTHBIprIWOPnysAXyjaquTTsSQBKkBaoDfYrXBqDceGCyWOrqacrGyQgqiALlHzgOGfYhxltOQIuxXlGppsBAjEmIYhlappYmMTMyLTtTAsdJXhLIJwEDbTwfBlAcJulHUWtsjkNmAjeMGUHtNjbWSgZMdufokBnHTkyJBtqLAqHBCWQUkZpeWvaYmKEYxhNvAmxZEzLvRvAaeJJAHkRGjuUgPcmygKhzcoyxQeFsSthAFxiDAXzYuBlIEFZBnNfjdBVhEhjHpPBkINPffJCmGtipcAVgMjEOyjOniIFipkwZgwbQmYBooLmBgKaDtigKyWqohUhAvYSMpdsexwtEjKkeONAcaUeNwCGOiQWWhNprqNTJNnXnpvBZJsHywMEVodKqRgQMrWlavRadSOfZdsSvqwgsNXlXkEAJfjDokPcSvDZvSMdaxfMnYkvCJpTphuwQz",
				type: "dropdown",
			},
		},
		{
			id: 33,
			props: {
				allowMultiple: false,
				items: [
					{
						id: 1,
						parentId: 33,
						value: "RtwSIZsEzDlkJyVveEdgOUUhrhleJVkkFMIPCDMeuxhxmVMcLZwhfGLwGKcJGoOFSSkaAAUclKwAibKANdzIgTBSZqVLrWUNSnMUkslfGNdLHaoNiOypqHJtwJjkmkfrfqUWrFmVOKZcSwTiOMadoHuGcfJnPfIVvRhwxNNTqiklwzcKITqbsBXHNHfVFBDclkmAsnWUgrgpBaTUfulUGTEphYRTvHpzmuzmhuDvdESNpNHCSciHAKBzYABoJjkNDSDEyIKpsLZlCxNPZJSVVuJToMpJVHpuJAqCZemRPPTH",
					},
					{
						id: 2,
						parentId: 33,
						value: "qfhiIifwbLaJdbgXmwkzTSpTaXBiatqLXNhmhUVYlgUHiQulvhgHOIiYtASWBiteDsnPSePCceDokoohUoVWqeiVXxNsIfLxpPNSkdgMGlLoxWjbJmClQEzBDzqNIgkyocEZoynLtYHiUWcNevjYmbGsoRmobLFgMNwGpyTGfgZJdDSdHwoDwaZypWAVQRFLZsJQfmriVETQFcjkAuvXVeJCWZwPHTOZmzneytpNwukIuIzWOVdIgLREvgzUaVozsYezaXFEAUKjaHmCXduaAqTRAEGufgFBWnXmjQIgPKxM",
					},
					{
						id: 3,
						parentId: 33,
						value: "wfNjEOvQwsyhTVYjOkakfOldujweSuzQNisoSQMcoQXtotvCuyQWTYFhDtWXDFYyVHTqXwltkQktNHkTuSfWUcIxKrFXXSAcSAXIotcIomzLSscpGXjGtVQtlMNWyBpAEltuaieDuSNZBUIzoXcQYfvPAKyYhuZOHYfEJONHwKLSIZFfOXkfnAZVFWhbOnbPZNNEOwdPXDYbLbyfSFvhueOJcUXjuuloUjZrONLRjuXTPWDZxNFuKkpgSpuMSSqVmtGzioCETtBaIWmqlWqLvGePImoUGnijIWIoOWAcGMaV",
					},
					{
						id: 4,
						parentId: 33,
						value: "kfYOiqrNWOrwVUAISiaujnniFZCzyRRdDvVfQuSogSFXwTSbZvIIbxSmGJZbJHfKCaWhaMoFiEqILirmLtGVtblLsUzvlNKBYWwwKwvmvhAPPFQKXcorFTAZWCxIZigLpoFPrLqdwyoqSwkUllkvpfcpyeRDnqRShEWrusFbctVgkPpCEnlnevOLgkJexgghrRhnoiKxMYQOXfZoooPqOwSCCsVkEcziYfTpLsywigAgQVVdfhcHtQlYmULDJpUczZkOGYHSkLOAgsqkpouFEkOWCzKLtufqYVAbAfGJREmW",
					},
					{
						id: 5,
						parentId: 33,
						value: "wTonRnjHECYxNzbhIvrlSKhhuoKaxETFEnfLUJhNqYvbxZSngnqwnQFReCmEVIJWvzHDZoKyUnPsqjQenLdaNMSpmKSMBTIaQWwVZEaOLgvlhcAWLUeVedWzsIUBBArcGTAYdXgUPSsboleUOIKmXomgAZGReUSncTFxOIJtXpoaJXXKkVyTZQxzxHLyigxczXuKbtKJmGeIrJuFpDbgnqKKGbzQkYeKMADnhjkLcYSSqvsTbkOhUcvaEHMDuGJBgGHYRaHJVGJthDdJakXEmcejrLgdwAlkORbgZuPcayIf",
					},
				],
				required: true,
				title: "ZpMNPxaIUXPCCXkmVNuTFmaeXlWEDsHdGIvXZXOEObTPnCWAGsasXzTLaJBEJJXoSZPJenxVWPNDbeumfTjwpgPHuaIXoHKDDfOqUcackLmcDQGRBverPbOtqJqWfVDbLJXRBJgRwCVsFJghhhLWunRZlrMyIbOiNOZWSkiiWsTHKIhpgHNPyEZxiUoVjOSwRrpWZYtmsegbMEudVbmQrIMVvEodRuQOhmQwnoElHyUyZSqsnqbGfwcHDWajteroaxIqzkDkteLLbEICKLqyVmCgKcgdAuWMmIRlDHcdfIqYOphVEscHiLUpGzKckgcRmNGMMuTfvvDKMuZhymJOvNlQZEaojnOeVAfvatTKZInoAhqHqeItlkXEFWLhuBYnErRnwEJjxJvSijlpbnLWuXgrSCeoQXsdMRlZegmfqGwBCNDubcUvlqpEgMfkdvVDqBKLGrdZuBhufrHZPBynHAjhzGknTBjDdDlKkjMLStzufCICZHwS",
				type: "multiple-choice",
			},
		},
		{
			id: 34,
			props: {
				inputType: "long-text",
				lengthType: "characters",
				minLength: "",
				maxLength: "1504",
				placeholder: "DYmAoHhfbkWlVfDlLCBapjtKzgrdtXwdAufHcWluIwvjaTHKDZ",
				regex: "",
				regexMethod: "doesnt-contain",
				required: false,
				title: "jYwJWKSnQCrwMTsilbLSyUekvYhEtOSyOzyrZklTTToSqiEjKKUtXQKHUOtSEHCUdREvumNwGqSeReTRitjPXpcVvkRLgBJkslnCKXECRKgJemSnbSULQnODjtYVltgjVKiQtBBMjKvSwbtnTvjbodvwyrDpnYyldsqcWqTDjBjWqUoptDWgiyloaqWXUCPjzPLaJKFtMXJRLymgQnRhbCASuekSSipkMvCqqDyBtoxmnyxgQdrqkyUReqmkhmVMaETxMdCXCDNfmCTsDZltnteZjneSulEuNuoGfGllhtMNwkhxxcHZuOlqOxQnueeBGruGSZkOnAphTgbMViugGkijsYTMDFROIZNgettaxjIwMhOOSPdzIQljNLcZLRmHvhcQUFfOByThgpGeBXbaInXwLRUMNwAqrmnDeGwvfwSIzNSjynSrxIxGMdWcCrCFEDtQzeRFXmtjIROpTuxZNVPadYVoRBcyUwKkESbrugrcZSGUhEXS",
				type: "text-input",
			},
		},
		{
			id: 35,
			props: {
				items: [
					{
						id: 1,
						parentId: 35,
						value: "qXCFSJOREfjoBTcOGJDuUqwexYhYMLbcjqyjisFMtlnmstUlzwVLpFXFNlqymLxGTnzkCbIEWCdUtOluYQYPyqQOXzcRTmlkerNuaSzCjSYhFyqjEdmIbdNlrqaDrutlVgQlXizowKrKyptyHczSmmPKstrBrixjQKYdCkciEkrGFyZJHJnZJgIGCGXEJTxFBMoiMSvlITzkfTCzCSNJRYLlUAQmckhEhhruTJDxFiHRhDxdNlyWTOymkZKRdNRrbrbVxkvLqzHbVZECuayeubpDXvIRPGnEsNKgPdKdrhcE",
					},
					{
						id: 2,
						parentId: 35,
						value: "ouGTymtscNxIpDsIotBCFkBOVvUdhStKHYfiSthqxBZUeRfRhGJQcLXbkNMdSjCLYaSjRaJYIOejtHrWPzyOhaIOHFgwsBgvVzRqRrTUBapBBKmZSzlfjMBJOpZmmUMNQAvzsrAFgduKxoDTuiqDdkeBXjsUoIKJKewBjTRjgfmflzGsKMYryKnfCIwRVAJPOVVXdPaYQUrJVkjgwDXQdpLWmuSYLAQhGVvwtJXqxOgSZORJJGGdZNNyBbgyObQpkelLXxnnsZLzGtnikrzVCVEDdRNZZgxCmCJApYrdeYTI",
					},
					{
						id: 3,
						parentId: 35,
						value: "OJcSXreXLDDrphcxEfcWiIWQtfTJXjDfGPeevfmZWFKEXKwnSeDepxlhRpHtjmwAucTbPUxqAmvOrlEEfYJOajKKXtuvfmxBrHAEMnadmWOZpMKjmTagnFMdKGjvIMKRiWQSNmwGrWEBIpoIEVvEsBfcukcYqVnzVHBRjsrbxQQDHwsGFDqCLagFlywwuKzUwKlxXIodhKRaFFwbAETUngsooIWCankaUCxVCMIzriAzCrSboQOdiytOlHsJRKxgjTkVBrJkUjRqqOouXarRUficuAwZXOMwJykLZmyOTfQc",
					},
					{
						id: 4,
						parentId: 35,
						value: "LkfTbJWBicALCrIFDtWJTYFVWfAtrEcKPUVWLDhBcRBAFkhnuOqltclGFYYcBbWRlcAujdZxcpJbZisPwWrhjdClObPVCpSjvRPDVIoMrLJqTUSWCnBUjUaTZQhwfdQXAfOHsNDuxvpcpJiwwOnlHcWZOnDltGWUEtdwSEJdqRWQHThqBVPecalUAamwROicwsnGXnZwIfZvpdPaBlTdKADzscczLvzQqQoIBnEyQmdwVfotkxHAXEevJEyoxovwkgeBawfUVRvggHYKrRfvfoYyisJvzbqSwjWsFGYuuSUg",
					},
				],
				required: false,
				title: "MHIddLbWqRWIRbEUTEYXaqXZwDAVcSXzpIhurboJxmfPQVZAYvhrGyKPjvjaDQstcplAlRLDqoOKeAaodwLsZReNkpuJMkyoxBBJhrHoKVxTSxsyMYTWIoHdTLbwQqPSgIBIbZdsiVDYJvwKoQyUqBPIdDFSQTxZOJtujydrxMWeWYTPAeuoibobnXgkgdKYLTzqQkwxuqkBZnzRvarZoAmqpbcTrERSgioxZhbxpVmLEhtNAyLbkfVQjMCDHTocsTBRFPaxMhqfyWpqewfKkEbevJALjgOdPhRrqOwPTNhBqtKmdVfamrFIJEwrQJaMnhxHhWbGhlbRzArqOvpnYTQqYEqvgEjkRsMMTHniMBYCWexuTLnTqScltpojybLXWcEHLBWPxXRloqgDKcEqMltYpzxcxKBDFZywORTHCHMVuQnoMffhJRccoJsrxAxilTHBQbNQtBnSfoOZKufqAnNRFtAmEOQmpqwmEQXWhZObiCmWpdzC",
				type: "dropdown",
			},
		},
		{
			id: 36,
			props: {
				allowMultiple: true,
				items: [
					{
						id: 1,
						parentId: 36,
						value: "cUgPvfBMnFOeSmHpmHMsWqIrNJSIOMHAXhWcAGmtgjWYayxSaGeaoYzONJBDNrvdhtNTKpVdPBmsKyUJmJmfKDFJGsnZlqYfCDLCcFABipNzmLKAVZiHxNPyjUcFUZcRrvtaHcBslBLvuNPZgTvzgmoFSzOPdyQcYUeYVaTHaQOLHAcwlDWlFhoDhWncevVaoVuFPIZyoZdxuJhvhxseplEAVxcrNdbcGIVTVKzvcYVXhLPXktFIIuZjlnQJZPXVAZOmelckfJBHdTOaeFWLAhBPnbAAlreGCnJYhwYSXRMN",
					},
				],
				required: true,
				title: "NkTJxdYKNzSuBgTUKzsXcmWEGNmwfbQeXJCNksoqZvzHbacpolRfCsiroGjrcCvKLsEyVdAAXJSvVQLrgzyWsQarliMELyKEMHtzUFwsexihNsGaqDxnthLBdIYByoAtVrtSaPXEXNOEFqGLAioCBoiGxnRXPwHPXEGxbhJovnCGgueQtAnoniLrQrxOrgbKdHlWppWiddOkVNZhXzCXpreIUNWXRKTqQMBJbIKqrInfZbhKLASpzbIsiuKVfFuhVNzTRTTUSmbVbEHBisWVavprorUZepuzWWlVyhggyFtkmzgCFwgPnKsMqLfmmPAZgrUWTAfMsOEJPuTZcsucnmbtsSImPhTqGxONZwjuYgrrBKbsYqEUbkqunDrngMHVejRlfwBeLbRmEmleJrmGwxMRMwBMzLFOogdTduJkrqshzYuQaxOafMkBKQzxodnZfUgYpAYIOXtVDFVnKclqTYAjlyioTkMeibHEHvTUTCuKfXhbqtTh",
				type: "multiple-choice",
			},
		},
		{
			id: 37,
			props: {
				items: [
					{
						id: 1,
						parentId: 37,
						value: "UtSdbvOhvjcathxztUoruruWaJkLVTmPtNPlptdBkFnXOkFGDwCawiheDApTIJquLEyHjHwBiVuTGvDwItxepXoIEJoMZSkpRGxSRrnPpmcVqOCMVfKsXrcqFCEpNIliRsTpNalwUADnyjUFjEnLdqkGxwdCfgHhDPtLeTtwtbxpLbiqgosaBmbwONhwSTqcfAJqLqDRwcKXKVkJQFPQAJbAsUrRmqfUqoNAXXpSPelqGXhthxyyMKbFOGKZozOvwWgqqVixVHXnTaypJyFpijebhdvSnacnYmANqAVdJFDi",
					},
					{
						id: 2,
						parentId: 37,
						value: "yVkWbAbxKLUySBtnDoZkmiyjDbREMtnEIcbBgzkQNdfnFVpXznFxMslyebFSHgMxEMXVTiOxoLSXjecFoXYSVMShPXxRwWncotjuAbgwTHhOsjYEVFDXivhydUCzJDbhChDgsqvkeFEwqwKaiBEKAEkFIFPxqCQOokNTSRsdXOjkAMaxNoruBqDgBClhYEYHeFKmUEvgESrLWNmcykjwVjGZSlvfsdkGKbYqWwfPxlHGshlmckFsxiPsolgSZPUvjnansAglOnEszpUXSksnwvfBcnssRYVDdFgKpVYhWzPe",
					},
					{
						id: 3,
						parentId: 37,
						value: "eDmdbGxsLcVLvlSDoDrchOJjvJucfePoKVbgusRlXUqUwDawOIXiVKdMoBPbgjEwGaMZkMQPosiQEwzZOAzoukQnowxXutfuLxLlxAKoswtvlEurlhPmkpKtynYMVLKlhnGctgGMFOmusuqerkQhfMvbPcGIjfiEZGzvykJsuNbxwdcmcFhoeLwAHWuDXkGrYYWeyiZzwqbsqspKNgaUvqvXoilequaKcBrBaLfQYzaacUpThIlCBwmDeFQPlgvZAffXOeZNKONiNwYbTLMIiMPlCFbiiokxHVrsICqGApCI",
					},
					{
						id: 4,
						parentId: 37,
						value: "CFLBGfgHEBTnESPbgvOHsrMVoktwGGDsjitKiRDfQzADqFmYWPPjtCYxyEzUITvciXdlkiDbxziZkLeXNYLvluWtDIfmYhBTXrbchpzBufEPhFzCREdKnGhgZXMFwaGUhzCjXOApNGeyCFuitXOLjWqWAARgnTAGXaFSTQvDwLNkuyYrcslPJfXoKNbdObYxPhYDrokrlkDHEYIczWxJCwxHWHtIikkBfyViKAufjhGsLrCcictzxRdnyFlvMYlzGIKTKobewDnLshMcGGIpJnfiqEDBELImLbfyhVUOyxxH",
					},
					{
						id: 5,
						parentId: 37,
						value: "vJEeUmbnIhKLYqaypyxZchgKVQLXWvovBwZdniAFFetnItQhtDJznkQolaChCPuCuOEBqHJOULWBQZpfhqJuPNSnTOseXTsbJRomHHXvGfuiPXcgqCjTKSkucUicPKyifTjWHnSInCOuDTWKiApBhQnFioSIAkBqMQqZEyjChEGSgsIXbpjhiVGKQhHhdNwfXDJmbHtKXrZRDyvkvmDRCondcFmyiJuoMCymdRFAPyGDgNGmvgaMHtcjWQlZaVpyunWiOCqiKCwJZFUKhqsRLXYwHoXgUNrHgrBkcTgDszWd",
					},
					{
						id: 6,
						parentId: 37,
						value: "urGfUxUnDStYwyEDipWqjLztDFlsaWBoYscKzEYOTQoBPtLMPzjFIcSDyTySHyrdySGkVDpVUpzcQpxmpPFzcMyQiTQARipjCJEibwCdqPggDjCTIdnaexdVHCyVwGqvrkhBtaXAftPxbkuGEazXswcslFxTTulXNpYKptWmlDrCMgcqrGTJSEJPbpjeAzDIoaOujlpUVZxTgnDFUZaDnoFNNKsFjeDZuiSyqlnjrwhptQjTEaGJCUznCAxNMLyTcefuZvjeihCieztUQOHuHqrPgvpGZHZCpRiwfHbIERyQ",
					},
					{
						id: 7,
						parentId: 37,
						value: "QlChLPUlcwSLozrsPSbtkYLGfLbjJliNtmkvrcDjCHqIbWJQxbTFVfrmoMolnFtCgjQqfxzVtBqUpvGEXsRHpvIouaUViRnrXsvKQuiQHSnpBSdRANwLpRvDTLfCVSkCncFHQktCzJKLlRqZrZYjJcOFyCfLXkjowsOCHiaFlnikCDcvVezsUfaeVVeMIHraPLkbXuSPTusLSolXiwyzrOnbqEzyKPKwxYjfCRVkThfySgQbxkxJaryuZfzJliZdRzcgtdnOivKlXcWPqlXVWgHApFTywGGgBPCCZGCXABNZ",
					},
					{
						id: 8,
						parentId: 37,
						value: "qpYITTsENgmbskUQeklPlxTxIzSmoreoaGjAtJKmpppxJFNliBxDfcExDGKgHQorrEpmAyltxuRgMYfMKHtWPxWGTuHGpmatCyGKqIuLZQKNVpYSkjmtPtmwBTSsBZMBNwPgJZRqfZzLrCXZumWewQmPIbiLukPBgvsCyJZrclMQZidYlAdZmjsrGZugRcHeYutIOWxDEpGgAclNxLBDXdTUPjZQBbmBMjdCOKNQkXHGFjNhTQeNuBrahjuighjqAlqOTFDvddbIOgtunKLZsBinKRlNTiEPHBoEFtIAOJDS",
					},
				],
				required: false,
				title: "xVbOBwBggQQBfSsqOMJvrAFXWGsRrbbQMDfqWpJXYrWgbKATkenwEDtHtNeHBWyhmqlRAqzpnJNTOthXtXkEsUKGhHOWqHjycCUrggRJCfrkmdjzMrACMvLgnWVReCNlusPpTumdSsRNoPJZLhhaLGmEfEsaUOpMVWWPMXdYNRUttoUslPaiBKWVNOkPAHkCOiQQyDfLNvZUHdPHlwFdCfmfjZUpIatATWhXSHvOrsLkBXuqEgOaUSFqGrAqgJDyorYyiYzUwhJrSpQxhTGbycgYuADTYLadUmxxieMMiHDQcNHBFEbOQCdwYWRWQiEZzgxMvzJsXUZBVzIUeDCEpfYtKeeztqrGgmCsrGqYvrFsGSjVIjbsXOYXDYqepjMgWqUotcVqEYEuEHmkkcUiFLiCJOOiKZkRHUiElPSEKGEUlPowcThrTotrSwSJUxUCiCRMpvznOMopZALksRfBOhmOyQcsvWiTpLwrVWavhsOmFUkYlHwb",
				type: "dropdown",
			},
		},
		{
			id: 38,
			props: {
				items: [
					{
						id: 1,
						parentId: 38,
						value: "RwjlumPVWqPEFYEXaFmazktrjNcVyTBVkDUNQBFgYlwWNOeYOUMnCgLOLalKHyhTqmmYjRnIGjdEzVdBvmSjLbeBiDEEMvdRRFFaDwaaZDmQRVvYxcKkzmyzHCyekkxHjRHmcQKVQcrsnliopIrpWMQsNnoizIsCgiJLFcfeDqRCjgPLOxcsidbGLCOrAwqbkoAjyJzzMgLUrpYfHsVqwyvwJJSQvHUeabmlXUZZnfbuRnsZsgfiquwSetoAqPhuiYylRkiMtySKXAELyIKtCYrAgcIzoChERohKVltNkVKn",
					},
					{
						id: 2,
						parentId: 38,
						value: "tKGeUjARbXmEnaesXFcALtOExgTAqZnVAEAbPVdKwcKJNQsAtvdgsJFQHNzvJPXWLUeqyvkSigFBUWpvXAIdntMkVpxJKciHScLEhFESoNekfrzQpqmPRNHahNhhnsOrMBCvoONPnNWvKxJFJTIjXuQoaxeXPBPGLoneYahnVMHwjMndauLBrsqMVDkbTkoidzYVpIGXsJJoACXxnQXroWStRpDNKlwNaWAYDUerwpGTrUstGkIzBxtpzmJBnKzEPmrFhtFirdSknPozHZZrejCbECWrNcVtercwzNUjvTBq",
					},
					{
						id: 3,
						parentId: 38,
						value: "jSYEnUNufUhkXNhUgFAnpClwYlxWTDAaEyceOPRETOmoEUQcrlBIiFJlwzCjdfsAxWkqwKSEXbOevQFxudIUnRZMqoTZQzltxloFjyTPEgjNEhEGtEcuOivMCbFLQqWlYjXlApbnaqOmSvUVVopNbiPbSsfWWpLNEGQzPDYKauCobGLgfVJadKIbATydqYKyjumDbZnTkjbwKzFHGGmTTbynljwLvEurIdGUHLbSnTRrmOsbsJQAHTmZvabylXrvYAGxBlUvmFWKxaCHnrhrkpoLrHGbaUuCNCMLJNhMiKWL",
					},
					{
						id: 4,
						parentId: 38,
						value: "RgENkrTeZUHRBmSttDRlGIBdMwBmSedYQFUVJaDbgIdBbrDSCNpgjoVQwuQVrDLWVybOgXYWpjnEAQxtgtrFuwkGasuMPHOQGuDywmDeRdzSTluMMibcdjrCainEWosIYMfyIBhfbIgiaJQibOQcEUknHRUUxOgcItXwIbLzlaZdSYStYTxcAFDhjBiOTXyXdFHYIjryEWxZzeIJlEEpMJrDgUhrmuHwPAfWFdsRKunGwoXHiAOTthyQnhfaWFNJbkQcImfHofeLXcLckObvcVekPELlVoUEoVJrSskKjHay",
					},
				],
				required: false,
				title: "DNNFxTybuwYQnaboKBjpXJnaAligBOxjlwmCmcQRHkeUoUOQcXpZiZMePjOGZHqhcOERXaAMWELMbNBcBtBQVkuvlzHJDHridNXiPmZCSLezRDaqqMBFxtCLPXaJHZQuzxNEQbgwPvhLcCAhCwnYmBXHtlrVOwVcPZmxFciMWokQmajXhCIRzcYVbfowKQPvJXcHRJLcJwbkjhpXVUSuvhdScvnosBvCJtkhZGDDFwCzBuUvtrQTHXrUFUICoTEohphhGrWLlrBbLOGvtteIlpKVxmNSnVjCTiIzxMkXvXkWFCmCRWOLzZLiZIrnAkvGsgIYEHTDWhjinYjrsKMaBgfRrqCFeNEFUaKGfvynTbXDsYCBonLZqiwZkZhuuFieQkZRGchwtlRqxdlxvwJrxKzhFCvkBjFeVRSxfXUfdcqsyLZYDFtVrBddvUccmMsREydFyYsWxIrhIuGFjUfQrUFWcyFDfdFgPrVgklsgZcnODYHYJTbM",
				type: "dropdown",
			},
		},
		{
			id: 39,
			props: {
				inputType: "number",
				lengthType: "characters",
				minLength: "698",
				maxLength: "",
				placeholder: "uwtNIbhLZdGxynSXWpwLbhRznxoSnUUOgAKNPxxHiLGkIKVVnt",
				regex: "",
				regexMethod: "contains",
				required: true,
				title: "IXZJVUzOGTBnGYJjtqFBSMuuDcSsEfxygnJJnvqqwbRKKUysDeCsMqVpXCXNRjOGoCImTQfWdvhdHEUdWvbKOEwwTCedXPafjdhsfKMfaMiJGPyjLpDGXfnfytrnkPkeNfwAHQUbqiSltjOoFbmZCrQoQcUApPiimiGpWFLnolYxTNZPdfgLvcYnqcrDqUuHtoHCqnsjeKVWpNWoRaKupEKAaYkFrhDPCQLzRVYIuvFgziopbNFSiozcJqBdzcPIsuyVYcDscpwxjCOlWIGHfCGBYPmjEsNNdnBzVQNjNXesMylEiRrWcMUgLZOkhdtdsNCrnvyYIVIbpolJoIKKnvNOlkSNywHOckxjGZmkcViMUKgWpEeQmPArSBHGSRwuuDrPCckmtEBlimSkOBeBfkdmsvrrADBpuirEvFoAuusGElPsvUQLvZOpbVvPElzqPjwYfYkfujvYVBZClRwPSUvtaSfloxBTzAEdtYXecFPZvgLfILDK",
				type: "text-input",
			},
		},
		{
			id: 40,
			props: {
				allowMultiple: true,
				items: [
					{
						id: 1,
						parentId: 40,
						value: "nMbVIvvMTCXIMZNJxecFkLkPuZPeFAySyKqlIhGRDFeSqmQnOaRCZzVzRBqMCERQGKDLsFkzgoFoUEfOvxqThQZmeWYzeuZkaJxbthjLBNviGWfyUyQBmpuJcjlscABlPxVKejQwwAIVFfLmtKAGBPeVPjnAnUlcyccUNcwYmdNtlUwprOqZSQPTfzqpaftsBKbHUKxwnxwTwUahgdCGPnhgrKIxGQEoKOEqIfBirBEpaqiYjvVutmzpEKLxcJOHKTOUVOgxJDLXJUAPvksWuIrtineaIWcTkPMIgSPEBxTv",
					},
					{
						id: 2,
						parentId: 40,
						value: "bIRmjjAiWCwiRxXOUVtbZaVZjmJsmFRECesdQfAbMfbkZLJUsBTwKcKovQzOQRaiEfYMTxSLDtGymvlPAPtxNsEldksFOsANSVnRDfqrnGLzQcBnUOtxXhXMItjZhLwoQHkhRumQzliXFnKQPNRpsjaHuXrYkPzCSNRmfvQEohlVEBillcSGzJXSVzDQDbdxqzjTixLEMMbStHnLsQPBLxvVBOepTCWlDuYCZzvzHOdEqOkesjYPHFqMBrAKLwRJGfstEueLNvqaOcMPADtuwMrYoavgEGvDQdLAXcBgBIXx",
					},
					{
						id: 3,
						parentId: 40,
						value: "LREGCwYQRNrykkQBAgYsolHkYOmwQAyaKPwTJYdQepSQlHULuEFTjaSXiXkVGsZEukhBbecCSdNdolzIDhaqkseqbdQFOGoTWKhVbxUGgpYqncAVcNKizrZQlOTbCwNTPgLaGOjMiJqxonkujaAGkTKqtCOGTuQuSGXRIhJHkwoRLyYLnsXiDCYxADokIUkOXFhqjjDHjkOVEHaRxutCWEmZtuydRVLsJZvhPslkAQitMvfpMELHuInKWhEQYrkOtJyQZiEfqfRHapEcsNUvvXnIMeDepNEZDCiEWohoVHgD",
					},
				],
				required: true,
				title: "xHImKPFQUUUJrhKZvRsvicjFEgrInMbclaSXlrrjelTjZWGCVJJwxjGnJuhbBjnoRsZgnJatAvgXYtyRpSparbgSkvMWgyagZqjyWIxRPWkXbupmIsmQzAJlwilLEhaadZzWjrFArIXYvnuNorwEIWwuWkzMpSwPBItxxZvLrmeCsMikZBYviZEipnzGkyrRtBRygFTfpCpOrEnyXWurFDDzfodVNJiRvMUmGrARZPkjacZWLlqFQGKcikkRVzUKGMYhVEhxdkndOhXfjKgOplJfhvvQBYqWhecCXlYxRzYaNxgBPDamcVHVwqOYXqwxbqQLBjHYesSWzaiAgdkXIBRbyqMxrnpdxkdBnuRrpqpQdJsmMbySphzFbytpXuqTaotUdPIMYIYBqyZOgMXNZmdiUkqYBmxfTMVVEvafgvHEdAzSTsjXHgqwKPfTGdDTGRQYufBsrblMrRfewpOGwFCoGQWdJwUyDcIPdDAcvpszXZhMDSzn",
				type: "multiple-choice",
			},
		},
		{
			id: 41,
			props: {
				allowMultiple: true,
				items: [
					{
						id: 1,
						parentId: 41,
						value: "CYvyvDSRNFxfNoilNoKwdJrCweztfZJmZiZwSiSkxzzOjuEPSIPVPnIPDTnogowwAWqRvhVDBRybkkfzwBDHxbphekWpgcACwMrrHPWBXofFILimuiWEGdbgyTpyBxWfsZzcNvELaMRiRsYkNvoruVqVkwgxbeXcoFDXLgbgMtzVjXMzAyTKTmCwOCOXfeeZeAAzfCaMNIttnRMGIYKQnRsGXgtECyDUCbpftHnKaaihyqrBUeDOisfRlxkjUajmkfEFaXzSZzHRGKLsrLoHdNBTOaAAIcSyORvHqvzLFdNW",
					},
					{
						id: 2,
						parentId: 41,
						value: "udvTqcUMBFgijrADBXZAqCbiLjvgekRNBxWyLACCMPxnBEHsDsizygWXupPkxwAPZGxbAooXifhHsAFBcQZHVVAkvWmNGAPzsxhyzaHGQsypnVEbPMxkJIXowuQmpmGJojOhPFVVZiuDlkOeYeyYwlvBtNxUXqllTqnTSDLOKqPoPVJAuoQryJvbBrbQLVuBHqVIriMzxfUdFwedMTogMERYmJxMOFnlJMIHBeNJPmhTLRjQJFpnsRwBjuAXJMwhkhAKdkRdcTxOlqcpXqqNKfraZXZIdKmmsKokGhDwvuSq",
					},
					{
						id: 3,
						parentId: 41,
						value: "oXUstiAILMAMjYzTEJIDtodOhpueYkimZeRpeZOMSuISgxkobWbiZQHhMUpMkNVebudMqDPcuCWzemNMWNJjqEkwwXiOkCtOpuRuiEzKXLxwNBFUJwshZkfnCjzvnyxnUCYnaFdHtbnXeqanypHNELWKYGiIHmDMnQFAlovonPLnXdXsTSltWWTPKDKDbCuKnCimxtdqzXMZZgXFRYWappWjenBXZkeOqbwUBadREkEKvvPfyuxvFHgVKVCDDgeLXdgYzRxMIVFntRVXwEiLADVvWOxxKWAooBEIZACZBiKw",
					},
					{
						id: 4,
						parentId: 41,
						value: "cfLBhLvQuJVwdsWmxHgjUcIJYSuAkEARRlFyUawsHNPmIMhJzMPkuzpDnZdfoBJjMNeznnbiylKMBlRbwroUhVNLbVQhUWnjSOFiULxHfkCYVtYvgsdFoeLepbeHlKXQvjAPqcvQOrUqcGIaFeehKiZjlPWGljVIMfUZwxAPUAFcyXcmwPuLkRDpTibvkqMHvQBUjKPXPbTDFgCKQtFGawLQfJAJFZNhwvwKetWXjrLzVAAHGVpHiXpOVRenDkGGDeTwRbGIRIQYGAOBuxhjDnsvipsNKILkGrLVIBJkmgFs",
					},
					{
						id: 5,
						parentId: 41,
						value: "UTfPESrlYPbaAkEjfgjsHkZylcFgYKbVtjZBVyxcevOORRGuYPmOsWCpfagUlfceNxDdNGJMxZNkmixYscXQvCgSZZxLlUKFBGQfxewLFrEcsrYMSNCDDbGoGuHdABSGhjCSunEwECBieavEwjYTgsiTsMZIIYiceEZLFaQsWtELsfbaHRrAmPULFqkIZfeNbepeZWidgdSrYTjVWcIVTUlubQJoIXZsEbOdnXwpjlRxSTYFrnnRVEkIvrkUdUfRsYjAVdbQWQrBZytxLFtKAtMGxeJdcqCOljnCFBDFJibx",
					},
					{
						id: 6,
						parentId: 41,
						value: "BygYnzGPBLIhsIuyrjEPPVuoqiEAHQpVNXmrMUSsFLjRIJQXhZnkoSwztiMeCeYQDvFOErMabMBECfGYziUgrAiilXwwkuKrWUlXCTMglAOfpUHGnfOtXptYdABtxXSMfephgaeENDrhOjwYjzxskMTuatyVXXSzPehrrEXeLQPivWiCffNqdWNWcIfwZzSVWuGnzmsokpzuckTLAfvYytqUqwNOefEeStewotoFUiorqUSxBDMXjlIirzkbCuwHyQgWmvvqdlHiPxpRNFcqKWuqqeAJjYIPXtamJRHLqohb",
					},
				],
				required: true,
				title: "iyVRlZseqdnuyoHjBWSSpfZMVcjZjAOIlFXqNPqVooCnoVlnZVOedZiPRYZRxENVBvSobFRPSqaTsQPuHaSHVZwFPQZOnrzZdhiEpRnkxzAHuMJKWZIDWGwbmjOSjCjqWKPKjDaZGweCPzpNJLRwnfqwoMoxwSvCXpzzDUHVgLmSJTrvrwHxaacxqQiHNkOuXIkThzmNAKzZlYhEnEPfwLgibbbMsmzxfYzBzsNdUsAHBQuQzRZNkVigEXUCOraYbZrZCHpULiCDsBxxRuXEbdLtYmzneppwxHkhlxjpvXOkhlBidDoeIHYmXKtiOaehrjxzbLeNMTtIlfJtttrlPmHTfGdCCjgOQQUbMPkYrthnJDzVOCNmyPrPwoXIvgQycxtawuNWpXkxQAGRrOEjOSsUgxFvMlQpUUKEUjJxnPhQpJTOtcQZDoyrZPPNmhEZvkWtKKWhsKmfQGPHNOuuJPODCpJfCSBPhAgtkKrRvylcgugxowKC",
				type: "multiple-choice",
			},
		},
		{
			id: 42,
			props: {
				min: "4",
				max: "15",
				step: "3",
				required: false,
				title: "tROdMscCSaUcZSsHDTmEFSdJsovqxOZxbAVHGbpaJCVfmqbcrKBZdvBmcqSqPAZHncmazoJLagBlrAGKUyIQXSfgiFEYRZunUMeCjvXyXTSVRHnIxbaheDLDyzFnsbLjvqXmZigmsvHbLXYXTVcnQxfSpUCrLggJUqVBBqsAtncgTlXGLipcwNhlKjMmqBbiHkEUVhThTTpIUguujQSuJfzQTUSaeHWBezHgzduhWPsyuNEpHXkmEdxgdacNAvuEbXgOsXRrNrpIkbbiKSpiufbVxGikpsYptODHGRfwLfOAubpHSwfnxbQAcSeyQIzcHfPDnRewwKYccsbLPzaRLygkverypUOZlnLDKsfQUAMTdHojudLvpzdzVwNjEoXwTplzoonNeunfICkXMhuYBHuiPQXXCqRdckEBpaxSIizZpBgZANKKetioCyslvLxKAlVYqItUAzobFwqEfDSaaJVEgjaUWVGdZEzYLqJvxsjjaStBnZxu",
				type: "range",
			},
		},
		{
			id: 43,
			props: {
				min: "",
				max: "5",
				step: "1",
				required: false,
				title: "epgSDaBIUUxDvsJbEqXlmdWEsIDLKQwchtPrMeJFYEiunhLknDqqSIRFxiGseLqkMUCPGEctSPguutKMmNJHzVtmdoILekbqzDVONmYgZMSSlyIEOeiGQatHapKveqtoZhJXaASNXEpZZTdYtGwDQvQmwDBiJwArnUdUGLKwMbwcAxdipLJZpJfHCrElWWQImiuuYtWOoDvLgMaAXMoKtfQTJCnSNkGAoBYaIVcsqtAKkdstIcVvRmyOuGjEXkbstLkmSVKYAcIBbteChlPvtTfwhQViuSVxvfCshhfUEORBeAkUCdkFAsmoknDIOPeWRznbUDDfUJrmUHtCiFCvUxldFoUXdjnvWcjiEvnfZktZhxtuMxJYnfJGvyMpXGJxdxZQnmrGoNfJofuKtthqJGCOMUDAdyHsKJYPcUBJpVEBWTLzclwdFRhUcwIPIctICuaLYyQJpdfQxUNPZPrTQHCBUgbRVrqFdxCrKCLpdVEyHxtcGRTf",
				type: "range",
			},
		},
		{
			id: 44,
			props: {
				items: [
					{
						id: 1,
						parentId: 44,
						value: "XKlaWRtShMrCLUkuZaWFhMyJDpEJYgIfYxORLauaZxKrreGZtZqsZUnKBNasrTeOUZTHaaSbtZQXKYMBKrrencKydiCQCmOSvxsAviSZjBkeHyrzjxKQsKChWgubemFJBrPXzHkFymqrFwgWYMjLfEgmniammnfzXyEpsolGPllSqVdaMrxTkKlxciZETluoFIXxcIxAoPYVHbytiCJQeEsBucabDMAVHiByikEmVzkKWfwbljHPkhSiJzMAcqTPTegFEmcjxtTORWMsqVAPSMfxeatOQhOohjkwJEvhNkqQ",
					},
					{
						id: 2,
						parentId: 44,
						value: "ZmvOAfkzBjdWPEIJsIkgFRnNGSoUmAnqiNVVfXYpnlJNnmwPaQwuRYbKmvPbGOeBqgFzMpPQXISrrKuMEnopJAJSiqfHKGzoFyUvvjaXysJSlXQLjMVLXJHULjNbvWVoNTDhjtJgmuBYTvueggftWDoyuQuhpsCfIBRSGXdjyQgtRKnfUWWKitbflNnwOKRcaZWhZRisBcNlVnjYmbdYYqSqHjaCFoDFPjFVwmKkxNlGxlkQCXfOGLvpPjUoRNYiGPnMllaRUXYSywDcaqRKVwBWuICmWsJOGypEEuQMCBcK",
					},
					{
						id: 3,
						parentId: 44,
						value: "EqBGmgWKQEmpKisHDdmVpLcqSOFPgKDSmooULEpuxueDiUjWtTSUGouZrWUrmXcHyVtZMDLFNNIqDDJPVdeLyyyIKwcaAsNVRyAsRNYAWSmmYoEjJaMueDFMxKizMVnUXcHCHxxYlQBwIPzPNhWKeNjdVjIaOdAkzXUOgtolouHTEXWEKuLmFNBBGwBSIHRWpDuVRaPIrukzpdUIprfzzFepyttVTppbJEHHaqngNKdVSWubkqKjrDMrRWEbvpFiNWdyLebLjhZdLdybvHqPXEppkXRhyiOIbKcRzhHiZEpO",
					},
					{
						id: 4,
						parentId: 44,
						value: "EmfbFzSAscPBlMdFRxJaVcfrSXzuUGXqdsuTWKFthdeNdcGRoQtFDUhIjUmIeJOPoWWjdUKRnVybKgoLyhvEJHXWYxGyylhcsjwEUbYeJQgExttyvupJEUmWoGylycuWOYJKoHpZAcmBxUUlzUxbSNGLqTYMuiMeWelTGtPNyAVZBQdedjnLZMiMGadLDRiDdzJPzszaWIhKTgcTfVYxQLethseBDumurWdmhweIzRmpCJKHvYBZFXcyImdRmHJoBSdqQzuQwXVDlnuWfBCFFQqGTRYyuvvTLdQKRPPZmsBL",
					},
				],
				required: false,
				title: "QhuoOKvbhIEKZFReZKCDZqAsoBhZVQJHPDHTJoEaipfgqdmuMTsTnkCwkrlcTlASSAFhXBrKxDhcJaoGXRyceFLljCvCeLtFCrUgzVuzHmjHXtmiGVgOxQExiLPdEFdwSfdTnZdmGdEytjOaTcbouOBqiMoVcofimiHLwJzUIusfZTQqetBdyTZIfgWmfgSatHfMrgweQeIxaNWyfqOTpFknVPjrokBLErOHdsaFvRKLEdeqrkaaHFUwuCrNFBmyymqcPdXkjNUwbwVupOhMhUnaPEWPBKdXuPUFSIPSxFmpGyAFRzyRTizQDRQgAsEdbyIjeYVaXdeWpISEnrrHZxJfUIlaZdnNkHPrdpZTMDSQaWqoTmdEeFCUwqjBoZjWcwbOuECuaASiZhXaNJSisqtpOaidCeaaVkRuXeBfzSkfzhWGEojCqmHMQhgRDdwhaadvqlDfJKWWiGQUbTCRmbgReGhapvscBbIhRXNUeuusLcegwhzT",
				type: "dropdown",
			},
		},
		{
			id: 45,
			props: {
				inputType: "short-text",
				lengthType: "words",
				minLength: "723",
				maxLength: "1089",
				placeholder: "bpjoliWfgWcpwhXearkcRQkShGgaZQwPaYVOqlAdQgUilEbrqG",
				regex: "",
				regexMethod: "contains",
				required: false,
				title: "nHVgUVSbBbXEtZyhlFKfSuTNwwWEESBBILmrtMteaRNUFSTiExreTxVvFmkKFyfmDdsqKAbWhYLYYtvUUHlxhMkrcbmksvCpacQcpZjdTHxiIVgiKpuBcboXCdojdHvxJYfDdozqUxMwcRmeNYnmOEdycyobsZWukMCLXvhQoagaNHfGNoFKydSwbYJGkPPlTmKtTusvCKFEpXUtleTqWrbStdYkQCtzszXNvwlagyXbAahWErkNeSJYjIZmynOhNGRyfRQkMNKiEjWtaAZEhiyAiizuBLYCyFFhwyWuCtrdzFtmYxyngjzWjkFxUaDiSnHcEQTFdkdLJMGznbjJFKZPvrLvcJbFQEYGhNohmvYDoVegwaAknTpdSomTgIfwDxLjAAhlFBhYVYxxVEHuRouIsgkTaskFkJFJvVyntSRLrcwzWelAVAxscjPnCQwQieGUPNQdJzmohGNqqQCnNeFGrbxaXRcRTEZWqkuQXaarECDWuMit",
				type: "text-input",
			},
		},
		{
			id: 46,
			props: {
				min: "",
				max: "",
				step: "4",
				required: false,
				title: "BAqRBpHSagTcxbtjEHxKzsvTtBnRSOlrWltLmjYiZPQQwivZnIXbeJjNOgaDNLsyZUhpxLbEtCJHMZkdnrOcQVWzKNfzuetXqmWxfUUWvhNwIVDzjxzMZfeoMxpeQeFUAMhvCEOzIlrDDBgDOpkwaJXYLFfHlFfxgSoLZioxVghCGuKlCgbWBkzMAPowliaaQgoAhPSoirCoVAumBeACLLHuKUvdjwcWjJQOZcPdbXGWZONCWjjLQTGrmHhYVdRajcUhwlptjaivdIuvudmtehiCTrwcSpRCJULVjoDfSUmUUTzCWgcCojtjdTYazVpQmCAwpSmExnCCuSnWHVFtzhMXoqUMUjTSEBtfxdFMKEKhTAlHvTRJTkADxFPPEMtjescJcSMFkyRJoDUNwgmodQUQglEwsvRjdqlRpadfeKogALoNhvOMKUGnJHRlMLlHYLQJxdfTLBfkheDsFPezkUoEnkrmCwCHiWTvLPStUThyvRXRPMyR",
				type: "range",
			},
		},
		{
			id: 47,
			props: {
				items: [
					{
						id: 1,
						parentId: 47,
						value: "PdqJgIpQngOrDIeHwFWIZUFAvzgllkUmDMinYPmppQUQoZTRUzsUcuXzlEDMMMIzMGkoEyBEONgDgtLMQraieobLfVCySwpQcCpdCIsjgTdmTrTsPqTrPAQORUqEDmLRNkLaBeHgatQhyVlnMfzlRSDqklvrnovSzNTgbOWkMtYnMUoDIuUzBVxUgLpmIghmBwmYvqUkpUUyNbGaFjDmIuLhgFFYenMsGEFLoEKAmZBhWTccCLDRTZpXDDOUZjYblkmudhSHujWNwEGmeBEYFNkQZjwtkkyHXpOHeWrnztdS",
					},
					{
						id: 2,
						parentId: 47,
						value: "OJNRFwRrtrrrlEsfzKdDdefglaieizyfhAjyzePuLIuxmOPoEQzzHAkmKUiRsSQHARnTBiDlsQuZRoicyMoGXgKQXBqYVcmNOgsERPBPGlSwmffaqVkmWRkzFUcGnMwgfeRmRYklgONbYwXpdCZFuIODuquCLmwrfECaxoUYQOcpnRdVAppbFbScoQGVRBqOnDZgmgiRHGQzWXsZhvortIpufdbDUveNwVEYmYSXoGKbCBgUpArfKmwORKdTwbbKZXHnyDjVOXeeZrVrnCuuizMxamRPMTzflwuhGIMADVlk",
					},
					{
						id: 3,
						parentId: 47,
						value: "tTgxvfLQgOaQKIoSVngsyrLTOGtDxnzGvZnRfLbOMEqpqbqxNusxVENOKOuNYYZRTdOudATLRjzRGjsrXUTjYxXtbFAWUiExaSwpVtSrqdTbmrkCndptruJMxKBZiSoaWbDRreTzkkhXHsovYFKFWHSDRFOEoSHDDkvUloHSZtNKiVUSYrFNrGUYkiwdBQoORknczDHazlwHlJwppbhMJbtHHxsEyGBDmYtYZAnxRlBOdOzSwanrhBVaCkYSXxzHgpNeXqbTAEKuqeGTpLKIyFssbaorsSGPzzlCfBMbivmu",
					},
					{
						id: 4,
						parentId: 47,
						value: "MzRIxkeAVmZTvRZryqXPfJrSsEqxlTNfHZPNxLGMIzjXYgoeeSfzLhRgOtpFKLsMJXwNavIKhRwGdlsuxQaexNnAPpnqFgJugEANnywhSNwDjhxQopUhhvjcuwBbFPSjbIweqDTjdnpZBlWrcolvxohBFkeDezOuQuUbNidKufEIYygRMQLmxvuSxYPBTUjebNqbhwZOUolWOkjkOOUaqttIpBbELwFUOpsZotAXxvUAEwKVbNMEZlkEvWwYrYsAIOnchtjFdrSVswxMWBYFxQFgbUIFQbWvTktcFzAMzVRN",
					},
					{
						id: 5,
						parentId: 47,
						value: "IRBnPoBCXhVwZsdYLIfbAibyKpLGyYCfeQEoeNOFPzKaPojFfbfdRGSPJyDDetbRSjDTLMPcfJdxzPqDqkKVjZDcFcJdSDZgJuFzyoyKsfuvpnzLYhRmJGkXwDZEoCPuUHsHVMsocEYAieYLqMCZeVDKREcILkrRbKDWWzKjAcvGsvItSFpWsUCCgIyAeBNcNyslfcMsiNQePUOhiQzQgAHtjRBBkkhbiteWPYrCRhlNpXJQGsQHpaWauKlWkkBsVctQjCRltEdhUQGdLcRXxVlitnbfmFtAEBBdkVaKYitZ",
					},
					{
						id: 6,
						parentId: 47,
						value: "QfletxcCqRHQTKLRKZBVEdYPLVlCxajByaZbzWsxShPIEVTGtbPxlfZPZfqvhlZyQDVVqYZkszGcshFIlpbBNXrqMjdadNImYlyYzWEXeRwilQbTOWAfGayVgNDAZWJPgFTotUhzDflPlHOhqwZGvyacCKWyUJQAnwlKmdvPCuHfhwMdTaDQajdlANhdpLDVuLxhTriGddoVzLsDPwoBDdcpAKazdTDfItxRRpYkYrrUDuZokGDlKHthcSTJFRoCTyASKpgDXvrutupXyGzmsmCxWuvBjdljMjtHeIwgefnL",
					},
					{
						id: 7,
						parentId: 47,
						value: "GVSmRJdcbaKznACiIyXSpsbDPFcjimLPXbNWburWDUhkIGXXPdTtBmMHdzupHVyFfWhHnsDPJdifzcuXCDvirfXMQfKAZQFYvGeviPTMJxylpahFqRWFAiVELYyyYxZoWXHbBuruoIaEbFYnKxXWYJgLMfPoKtAOTvsVNYSEAISgQNvQDooexoHdFgfTBwPNhdLRLAkhOHEumbacwNdVYGRBwOuRrzteSHLuRFpCaklDEwakvZvVOdaGQNoJrUumPSfRHzZsOwlwtmzQDYDXjYTfzihZLarRkFvsQlltjtHs",
					},
					{
						id: 8,
						parentId: 47,
						value: "snqFQuBGMVJeLiyqZzZdvaJUEQzjcBCdhRDlKERKZhSDLfjfsRtNnwCUgyYcNXmYcxPgJeNyAcGLrycoVlRTgzbaqqoPwJtDnJYAOVhpTwafaUAyRyKzqPPjIDPspbTWgFGYVDGSIPLRITVvbENTQpbpwKLVaioiuBgkJlzKkeYRKAPExdvswEItOWYbfMyqhRWDnzeeMxkXRBmvEYHCzrLxhrMLMDnTeWqCBAKctAilRxnYruhYCbaJYbtqYDchCpcbiMpgfGgoZtWewVYnvudtVNcWJnoVkhIfEENhpDCa",
					},
					{
						id: 9,
						parentId: 47,
						value: "nsbhKcXJtDGxJSKmDmJFyKAuBHAgSxwSlAKMxRfEUExDDYHyaINUeQDSeLafHvFJIpyWkoLUKBTouoLKmmsSDWIfvpkXNCyWfvnKztktSyzWSHKBzhSegcbbnfjBpvbmoDZBDRUUsHaOkxZAZEPFCTarrhXZkOEwuouILqhpPRXUPrnOhXrwBvneLfEVahnoAOpAjPrQFZLSeoYCzAjOLgETdvnYAKGPSSmwPiCUqSUqPdZOchOdDuNLXCQlutHSNaSgwHofRpNLTRbXPcsiecpiesgotpfQKiLIgsokChIZ",
					},
					{
						id: 10,
						parentId: 47,
						value: "NLXwrWAsWJKcDUxkPUNKKRvIQhRzYDerjKcShyJRSjMCdpZZcXcgQcqxPTyiZqQCqSjIRNXvSJxWVzUVfWBwXuIkKdsnwIOqJXlcZUAxvlPOwTdBOnOjFDDGFAswjEBHaORjJpfGhoPUYlLqfleEMzZLJMZUnPqkNBhncRTAgcgyVdziFhGZcYxzkWctrSALFpwjsPfNHjNkfVRSfkhrBaKYSDBPvnSwqguihDqqIFsRZykrqxqtvcFzBankFZArmkrVaPuJDRnxqIBomEwOHBCxoIdDoOBJCbSLXoEkvNeF",
					},
				],
				required: false,
				title: "vmkMAkTlPaOOfPiXfPszNQcbGGgHkSLIkYjWtVfisiJkIGsJjIENdVZLwkqittzfKHTpgXkJkOokQmiwLvSXTJAJcaFDANKgzDBBwrkhkufWUlrnxzTCblNoHRBHqhGEMzHxzymYvxHTknzDpsKFoFdsrCSAgveeFzNaXDayQHCqWZQjNGPArVWmQGRBFxTXokhYZBiIuLAWqqlDyJiwTFJNBItLGXpTkPYUfBygwsIhQXsUOhWkKNaUWUDvcvQDOkTzJAVUKuxQyZBcTWulWcSaEYfPcYYDbVOMkdxKIQnMgwwmWbVCxBxNwvRNIwjbyGEWUNiCbuThUEedECKsFBhuTYQLhbLLmkumYhwzkAZnuLTEAQbzGxJEljLMKCTIPoraTCfTOZxGtVCTTChECOxtUNMDOBHSYAAkqPpdSXlGSqBHaMjqwCxlAbBRTHUJDBcppDddkxeHKZsIdBnOyOInepmYEWmsoBCHNjQrcTyUaXhwJLvH",
				type: "dropdown",
			},
		},
		{
			id: 48,
			props: {
				inputType: "number",
				lengthType: "characters",
				minLength: "",
				maxLength: "1723",
				placeholder: "jnjldxFuZEQQKRakLCHMMnKIIwsnsyhioaioTbzSlenrzXuQbW",
				regex: "",
				regexMethod: "matches",
				required: true,
				title: "rfpNgfMtNLnyeFdDwvjHYnFWXzkufFuKFqEMdzgqqCGqKGeNwYhhOMpoCeKDUzRtuwAmLBWKTkvWXTxhkvUoPCeqUSYwRHQbNVJSCaZhwEnJOfbmVwZaNmlepSYeDYadOlXrMvERGHecoAyXQEqoEMFjEXZEYgTViYTWEgxmVxssiRAdmEAfVsJEIvcMMbMNmKsxmVXwsoDmmFEJbFxoTZpWaTXKILsaZbsDIArperPpAyuBawaFcpGQvsKXopxesBepNxcyEgiuPWFhSMnCSucpJjVmVnjEiCjxiibLPUqEuVOdbgUZSAqUWzQuOnTcrbraMkzkXphBatfOdFEQQDMXWwkAplhQyFwGDMwMIrzXcvUvrUNiUGaeFziPECVwLepCLoTWncpMbKrZBCRoQnuYwkcKjJSGOfUOJjGkRGuMZHAdXYwIvOdMXqojSikvPWGSuAhgJnCkRiAbFomeluLezdbAMUaKkWSFiXzYnRFKzdeCIBfH",
				type: "text-input",
			},
		},
		{
			id: 49,
			props: {
				allowMultiple: true,
				items: [
					{
						id: 1,
						parentId: 49,
						value: "bzFKnsvbjPhgssOghsAnLVSzGneteCNHsGDSEPeejqIKDCHdgIDUgicThXiVAKVOIPRJoMqiIaJrVJfSfPaPSGwNWIplKwYRosPFnAXczvwTQqkGyHpHJzpLahVdowPCXjOnhIniFQIgVpZNaqmbIzDPFeGkbwJLgltfIlZVtlVlsxOpcvoevihmtmotCColupKVBwyQpKErPNhyZMQZtedqzQFgXvQfRDkkBnTOLEkcojOJZodoNpgoRjRMkNrVbzZBupxgEhkZlHbBNrwsWZsTLydgPTaQsbLqIQXuPzaa",
					},
					{
						id: 2,
						parentId: 49,
						value: "pzDRYycMtpcPiaNLHpOmEJRtyKpBoZOqkzTBjPgfqAqTcjuMnoGCdOFtGDgYzogvMfRDrJAlqdfcxlunztiuIpfTnUPxyexjjumIgICMHEwCjPfrfAMQBFwLPCWlkPExQvAWhlXbaOZJSViVUrCmVwpTuohgVzhLgLaohqqGePCBuRzjgNpTgAcDvCOElqqtseHdUTEtsQmkpKSEiAKWnXRavMrCCCewusQcvQMkscadihZWWueULTHUUvVccUOWXPFKlFsqgQkfXXyugxgFVlQuPMqGZwMhJJsfrbcvLouH",
					},
					{
						id: 3,
						parentId: 49,
						value: "kWhXgbtrVHYkFFRWunwaeKEtinaEhqrszqbuLWTuLAOgkyBwHpQdMfzDwgoWoAfNMNdLVlXTLlAklcoOkUWDmaqxRzMvzFYIvGCSkxotwnXYuUYKpIxlWEZTnKjLobNyDdkcreQMUhukMIDXsYpWzDMccFyoHiRaoJviSGMThiqTrAaGErlFkSsiFGEhHEtIUKEzttZHHOoCxfUEHpeQqZRsAjFPaKAbHqGpnTGpYtIjmdHnfaizaKLKHJKYDFaANVfEoAqBrthVrFKEIBVjnJmvgNhXFKyqrkpzIKNaUYGi",
					},
					{
						id: 4,
						parentId: 49,
						value: "PWkbOfrxKvZXCFkIoyCmElzYuYzwFpqZUfZRGXXXqnvYqngILshdMRmFHnrBJgQAzsWcAMuqXJTprbkNuUthcZDlOyMhFlvUIomowomkbuFmoFGFdwUuaRgORPIwHwobgRnUFhfqRdSynMYCLTjRxDVqbrdEXbQndCGJDPzkCvVAHEOieKVIBvnIeDosJlSUcoxOkpxSyvqjbdAUOtAPWiWgmhxhxouqFZIksKGdStuzlbvybZKCWJYuXCpHFcYqnsIrlJlPUENggGuqgOlpgWGVTeoGkWOBoSPtGXxIrINo",
					},
					{
						id: 5,
						parentId: 49,
						value: "NfYOzMAaEXyBLnSjFhiRxJyWmhTrGUhfWwxJDHOPfhQwTLiZfuZukxapNywEsNOAAhQcaPzEBSxpIPgDDtLZKCMQtjOtdiDkynknlStbuJJpRBnTdHlzLAnuUvQOoscCpRLVEXjEGRSVdUyetVCeqfvHXrSpaJUdhdUMqfxnAAZhYqmqKTOwpKSNjvJUZxpOJlPkFqYbyJefToGEkMQNHwaPmCtJmfqBKDfLqjSXnPLcasZgeyDTUkklXLcGFsNTObXpdpGmasGiRBFfXsGrJklCyIiHjdPHZuZhrTDESlRp",
					},
					{
						id: 6,
						parentId: 49,
						value: "CQkWpUJoPnAZxRXlzUcSkEesKTckYtfqJwOnzTVpACKLyEuYPgmlHaVuZUZrqGHnHGPvKVrNbokfhaESoKTXOKHDFSuUfgBDoSUNWbKopmaaHHIkzDJKwUOPZswDFiRfurPvypjheflwNitnijVqGcJqOxGFAyfHjPeYxBwtMoVmfByZlaxSmtqfNGdIrXpoXjQuhEjxvoWLAHVsdhnqDFkGeEfsgrXFuEgapVXJeSMDMPkIEjeUiKpvhxEyycvmkIMWiGdMONvEWjQIlihlVWKsjXzuAhNgFfTOarTYLuXk",
					},
					{
						id: 7,
						parentId: 49,
						value: "EjNbFbFEjDUflVEjSaphSQuuvdxEfkWAGljNuurZHGILhPtpHjaDLkRsZRLjuDtfgWPqYoHlGfgZzRHkirFJsPZpXTGXFYCdWjOEuMUSJURrlPZCsLIWFLgQAzPoixrxKwGfofibalpkDddhSqVXqUWEwtUxqTYrGHMQYVguuPNncAYkVSSKrhBjCfKNLdBjZNtqAyMZEzwtxvauLUoOLITxAjSgVQioZGZwLSQqKmAFREMgPhQBOLlIFtiDxRgjFrCUqgRrXOQhCSjCMEgGrkTGIzpJjeZxxDpReLYMhaqu",
					},
				],
				required: true,
				title: "qCkFSyQmiExwGaSNmiAQPPXmhJCSNGdNkwfTJPAJbJVCCthgyaoPCOkAafoukiMIyXaeKeWNUaNleJsgVwGzPcCanLtoYDDrNaULZDFgUrQHSobjGvBHoNqyFcrcwNhnLtNTxWFtTSmPhUHZVqFeTgfBXPAczFvBHvcuSGZdZvyKctQwMOXQeEbkYKWTfLoDUmYmUloesMxDJoqIxdNDMbSWAgvVxtDKLkYAQnyuwOqSoFtAnmRshQGaVCsegBvUpJklKHsLdHbXmtvFgMfZYjXewDIbEKZfoKGiNRXQVwsTJWhHzecPhnpMrJKRBeXhBSBmoaCaHJozgyRxxYSiRpQqAxduoVCAWfOxGKBKTpfpmRthwLhDOnFKuvXYQPFUxIjdXiQIqSUqyDhxJKTgsmysQsMuyyOwzWaJFonLIrkfNQyAbNUEqxbOwbinAYIEYfICvxDEdxMMnvMQwvjCZlHlrKFTBNmyTcJJOrARFAmYRoTLTOTv",
				type: "multiple-choice",
			},
		},
		{
			id: 50,
			props: {
				items: [
					{
						id: 1,
						parentId: 50,
						value: "MEfnxjgGwJoQpZXRbOnazdFxlSGKoQYfCgeaRpASMYMDBhCyigHDsxQqlAFBUaNRcVXfGPmzVbTIoqSTEjyhYskhKIkynUqcKLErNAVyQHZeRppsGcBAYNejMYDNpTQhWpBAJNURWYzvfEBlicNqXcCbgSOzGJRqoBjFszLUrHacMrdbEwEPjmbruyzhYOfHwdOvzlTnyUJGXBzaOJocdndcnAchbREvWYfzfMwdRasNjKiIIUtDKKlJkArnomrMOkMqImVEMaswyxOJdJOoOkNvyiKFxnoijpAnmEVajvIm",
					},
					{
						id: 2,
						parentId: 50,
						value: "YHiSZwROyLIfAsiCdtcVBYzPrbEFiWukRApiHCFDGcpOIEUVfZzAdEgmqpXSrXxMfCBTTreiSpXmzsaEURUmzpaMAQERLEAGAzYOTmpOetnprZbHicgajiiUjdxbQzxSyTQluLpLQwUOUcLrywBZWHwYNUYTCZbIIrqpGWfJVMfRYDKJiPvuFWagAIIQcANDtGsvdbabuQpCepVcpSbQeyStZaemRkYYIYOYFoQhHmwSvqeorgevAiarpjfcJgGMVylUQESENzLOWSVZAAlNUddFlIQexkybrgsEpjsZdYIv",
					},
					{
						id: 3,
						parentId: 50,
						value: "whpYtjzJXecHcoZlGneOhSrrsVphOyYiIByxibpGIaQulRYmgOvpZzSJzvRVAZjgdoPZhkmWZLTDrvvVHPUMcyfQrHvHXTMIJKEIhanpFMJnAnnasRpmmdNfZrynisLxtFCxJiSgLkBmalkDYnuJUomLaByjlFckluajDRQcSfCswlYqOYXEcQLpfTroAMgEFqIqqVtTchbXyerIAkJrvbSZKeNxJAqbxUpQmALkuUtddVqdIgSGhgMQCAfmhNJJUzONfUExErvVwCFhFtSsqxxhNEVBkWaLZvvibTujpPPD",
					},
					{
						id: 4,
						parentId: 50,
						value: "eMvbQFeGbLWYniHQokomlbJNRjxmIbonyycAdMWyiUKerpanhimVzgnZdSqWGBHzYxxJnQptiLQZKcbgIrMfUchkWspBVwPdTTEgEMXPFKEsDysWUhEicfSrjaOAoXqvumvbtKPLUGDJtiRrnAFOLldqErCthGpiRETxdcoGRlMMtXuvyTMuMduSIOgoTdlxzUmmLbNIqEzgZQipQONmLQXPvKBuVelyDEPIDgFuqGGbErVoHRexXfTCGQZSbyGqHCVTsqBihTrXVysHgyhxRkRebZYOKOahflACTxUSNlhH",
					},
					{
						id: 5,
						parentId: 50,
						value: "hSoOapAyauqUPAEFszAHfKcEYqNnMtNscJLIZtTIVAzpxITsazTdDfnuiTfkIkzwRvKTOfpxUTPbPhnCYIajjJCOeuJTdPIdeDemUbPKsYhjzbUsoPKBxytoxPlfQYoYhFBUudvkoqtJQOtPAeJOfUKNnKtzsJyuteaGSIqYWHukCREmFPZfnmxiXLxqeulLAZQUCOFDVlIzRnlTPXVxpnDeVeNevpGlFuGenwOcFuxxpIHdqaGIVJvouVypXmQdYCniLJffCyUjZfWCeWDFzcrwkUERdYKmcGoEohemogIx",
					},
					{
						id: 6,
						parentId: 50,
						value: "lbwNELlyCvFpKHwgdsrwImNLTPcHrFbxHrMELglPAiCBTkWZLmiWNnQTuLATHzZKamJwaNUNbtuHEhXxfycfystmcFjCmKrjGQIqZIhDZKeHLBVsCoPXlAwNUCXoqIYLCrsTlEDBNROfhWvBozgnAYmHGccOfrgKdhRlyjkJdZdXZanZyvsIzDDSuFnEKsGIntHFmAiGzjApBVOxFRQqurzXElkZdjwDNvymEzjGRxxjOutbbqaQhrxtpOsgvkboofPhijrKkHweWiFRAOQLiAblofzhjSxhqjHtiRmagOyO",
					},
					{
						id: 7,
						parentId: 50,
						value: "YVxPrZTNsKMqvwjgzHEHQCkNOhmsIHHhIbZrEIVLFxgBSAEVwZmFnDTQllJkEqDphPXMmzEbFNWAwfLVdIVcMvppvPgoGsZkndCcHEtFhhirzEDxcArScBARGGdmvfAAjqgSBjwPVylvInUAwuzqvBYkSVrvgAUQqhjPTkEJEZejuotaXyXRffJZohxwdnBBuZULObkFCWBNCpjeNcXZBqhNaNdGsfxmGlsyeobiAZYYzGhTQSfgdoCWrPddTJdLoafShVgAUivvWlITGjHpLTvMrlQBFbBBmWhySVOLXbFy",
					},
					{
						id: 8,
						parentId: 50,
						value: "OPLPmwuJDUNPbQpQCXhdNhVYYuCGBEqPwHbIbOSGXRjPeqYtMBMiVISdCawpJlCgsCKPxkDvoEeHBmIxpSCxZOTBqixyPoavXaMkUXlHxyDrKXWkzeoOxGgkFBRtapZHFgRMhOAXqGSwLUELVGQfvulSpDpXJzUOHZQqndQDcMNDxQNaJfpNaYvCQWRbvijXcIXSBfJdBgKXOYnCsGJSrWgiKWSHEhJlgYyUYPNKmKZOdByWiLulygGgtcBiaGLLTHFwnHCBBgpyUpMVNjAFhULcbmKxknJhEkCZzCPsVWFw",
					},
				],
				required: false,
				title: "fabvjsbFEraqMmjwvjLhNPMGIMbbmZyEVHTKNOETcASsjcLXojjxtgAABxymberjQyDpwSfDivUXQwUcoiBEwVOJQoUQMTQcVLGhYNJXiTKFNvNYkqGBTnjcBhjCkwvXDLvbOjSXKlQPAkrRDPBIZcZOrKhsYdaIsWdVubXcKEbdPVtDdzANOuBRRDBvPBSTgFLCNUCpwzdUvgCafzSTkWTZsIadpRPcaVDawwfQhwZKyeEQqzjCUvQEQrdKjuPPHEemfdCQmywagyLMHNYTLYhBioQsfxkfGSVKtOEsdWueWZDibxKvoQPAEaztCFPkUIwWajXGxfLvtxakaZZqzItxgdOQKkPIkqusoWlyxSQzSXSflrxHrEOGosjGlHdKHfSKMFpMhArDvxduPQAXXQfJbJWbpamjkcgOddNnYSAIMnnNLjNlhqVtdBXHpeEhhswDGZhDaLVdFlUoZhyxMOyIqoEcODkOfxKgISVULrURtpcPGYda",
				type: "dropdown",
			},
		},
	]);

	return (
		<FormBuilderContext.Provider
			value={{
				formItems: formItems,
				setFormItems: setFormItems,
				debounceRefs: debounceRefs,
				focusedIndexRef: focusedIndexRef,
			}}
		>
			<div className="flex w-full justify-center py-8">
				<FormBuilder />
			</div>
			<Toolbar />
		</FormBuilderContext.Provider>
	);
};

export default NewFormPage;
