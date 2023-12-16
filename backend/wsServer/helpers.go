package main

func matching(slice1 []string, slice2 []string) []string {
	matches := make([]string, 0)
	for _, a := range slice1 {
		for _, b := range slice2 {
			if a == b {
				matches = append(matches, a)
			}
		}
	}
	return matches
}

func remove(s []string, i int) []string {
	s[i] = s[len(s)-1]
	return s[:len(s)-1]
}
