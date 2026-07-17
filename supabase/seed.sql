insert into public.scam_patterns(category,pattern_name,description,keywords,recommended_actions) values
('Phishing','Account suspension pressure','Threatens loss of account access to force a link click',array['suspended','restricted','verify immediately'],array['Do not click the link','Open the official app yourself']),
('Investment scam','Guaranteed returns','Promises high or risk-free profit',array['guaranteed','20% monthly','limited slots'],array['Stop payment','Verify through MAS resources']),
('Malware','APK sideload','Requests installation outside an official app store',array['APK','install app'],array['Do not install','Disconnect the device if installed']);
